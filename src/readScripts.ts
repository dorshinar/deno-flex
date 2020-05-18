import { ScriptsFile } from "./ScriptsFile.ts";
import { parseYaml } from "./deps.ts";

type FileReadFn = (
  file: string
) => Promise<ScriptsFile | undefined> | ScriptsFile;

type ExtensionsToReader = Record<string, FileReadFn>;

const readJsonFiles: FileReadFn = async (file) => {
  const scriptsFile = await Deno.readTextFile(file);
  return JSON.parse(scriptsFile);
};

const readJsFiles: FileReadFn = async (file) => {
  const scriptsFile = await import(file);
  return scriptsFile.default;
};

const readYamlFiles: FileReadFn = async (file) => {
  const rawFile = await Deno.readTextFile(file);
  return parseYaml(rawFile) as ScriptsFile;
};

const fileName = "flex";

const extensionsWithReader: ExtensionsToReader = {
  ".json": readJsonFiles,
  ".js": readJsFiles,
  ".yaml": readYamlFiles,
  ".yml": readYamlFiles,
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
export async function readScripts(): Promise<ScriptsFile> {
  let scripts: ScriptsFile | undefined;

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
 * @param func a function to run in a safe way
 * @param args arguments to pass to the given @func
 */
async function tryRun(func: FileReadFn, ...args: Parameters<FileReadFn>) {
  try {
    return await func(...args);
  } catch {}
}
