import { ScriptsFile } from "./ScriptsFile.ts";

const jsonFiles = ["flex.json"];
const jsFiles = ["flex.js"];
const ymlFiles = ["flex.yaml", "flex.yml"];

type FileReadFn = (file: string) => Promise<ScriptsFile | undefined>;

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

  for (const file of jsonFiles) {
    const scripts = await tryRun(file, readJsonFiles);
    if (scripts) return scripts;
  }

  for (const file of jsFiles) {
    const scripts = await tryRun(file, readJsFiles);
    if (scripts) return scripts;
  }

  if (!scripts) {
    throw new Error("Failed to read scripts");
  }

  return scripts;
}

async function tryRun(file: string, func: FileReadFn) {
  try {
    return await func(file);
  } catch {}
}

const readJsonFiles: FileReadFn = async (file) => {
  const scriptsFile = await Deno.readTextFile(`${Deno.cwd()}/${file}`);
  return JSON.parse(scriptsFile);
};

const readJsFiles: FileReadFn = async (file) => {
  const scriptsFile = await import(`${Deno.cwd()}/${file}`);
  return scriptsFile.default;
};
