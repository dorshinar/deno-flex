import { Scripts, FileReadFn } from "./types.ts";
import {
  readJsonFiles,
  readJsFiles,
  readYamlFiles,
  readTomlFiles,
} from "./readJsonFiles.ts";

const fileName = "flex";

type ExtensionsToReader = [string, FileReadFn][];

/**
 * Extensions are stored with their respective file reader in an array, preserving their order.
 */
const extensionsWithReader: ExtensionsToReader = [
  [".json", readJsonFiles],
  [".js", readJsFiles],
  [".yaml", readYamlFiles],
  [".yml", readYamlFiles],
  [".toml", readTomlFiles],
];

/**
 * Run a function with given arguments, and ignore a thrown error.
 *
 * @param func a function to run in a safe way.
 * @param args arguments to pass to the given function.
 * @see FileReadFn
 */
async function tryRun(func: FileReadFn, ...args: Parameters<FileReadFn>) {
  try {
    return await func(...args);
  } catch {}
}

/**
 * Reads the scripts from files.
 * Files are read in the following order:
 * 1. flex.json
 * 2. flex.js
 * 3. flex.yaml
 * 4. flex.yml
 * 5. flex.toml
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

  for (const [ext, reader] of extensionsWithReader) {
    const scripts = await tryRun(reader, `${Deno.cwd()}/${fileName}${ext}`);
    if (scripts) return scripts;
  }

  if (!scripts) {
    throw new Error("Failed to read scripts");
  }

  return scripts;
}
