import { Scripts } from "./ScriptsFile.ts";
import { parseYaml, parseToml } from "./deps.ts";
import { readDecodedFile } from "./readDecodedFile.ts";

type FileReadFn = (file: string) => Promise<Scripts | undefined> | Scripts;

type ExtensionsToReader = Record<string, FileReadFn>;

const readJsonFiles: FileReadFn = async (file) => {
  const scriptsFile = await readDecodedFile(file);
  return JSON.parse(scriptsFile);
};

const readJsFiles: FileReadFn = async (file) => {
  const scriptsFile = await import(file);
  return scriptsFile.default;
};

const readYamlFiles: FileReadFn = async (file) => {
  const rawFile = await readDecodedFile(file);
  return parseYaml(rawFile) as Scripts;
};

const readTomlFiles: FileReadFn = async (file) => {
  const rawFile = await readDecodedFile(file);
  return parseToml(rawFile) as Scripts;
};

const fileName = "flex";

const extensionsWithReader: ExtensionsToReader = {
  ".json": readJsonFiles,
  ".js": readJsFiles,
  ".yaml": readYamlFiles,
  ".yml": readYamlFiles,
  ".toml": readTomlFiles,
};

/**
 * Reads the scripts from files.
 * Files are read in the following order:
 * 1. flex.json
 * 2. flex.js
 * 3. flex.yaml
 * 4. flex.yml
 * Files paths are relative to the working directory.
 *
 * To use `flex.js`, your scripts should be exported as the default exports.
 * For example:
 *
 * ```js
 * export default {
 *  start: "deno run ./scripts/start",
 *  prod: "deno run ./scripts/prod"
 * }
 * ```
 */
export async function readScripts(): Promise<Scripts> {
  let scripts: Scripts | undefined;

  for (const [ext, reader] of Object.entries(extensionsWithReader)) {
    const scripts = await tryRun(reader, `${Deno.cwd()}/${fileName}${ext}`);
    if (scripts) return scripts;
  }

  if (!scripts) {
    throw new Error("Failed to read scripts");
  }

  return scripts;
}

/**
 * Run a function with given arguments, and ignore a thrown error.
 *
 * @param func a function to run in a safe way
 * @param args arguments to pass to the given @func
 */
async function tryRun(func: FileReadFn, ...args: Parameters<FileReadFn>) {
  try {
    return await func(...args);
  } catch {}
}
