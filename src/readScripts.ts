import { ScriptsFile } from "./ScriptsFile.ts";
import { parseYaml } from "./deps.ts";

const jsonFiles = ["flex.json"];
const jsFiles = ["flex.js"];
const yamlFiles = ["flex.yaml", "flex.yml"];

type FileReadFn = (
  file: string
) => Promise<ScriptsFile | undefined> | ScriptsFile;

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
    const scripts = await tryRun(`${Deno.cwd()}/${file}`, readJsonFiles);
    if (scripts) return scripts;
  }

  for (const file of jsFiles) {
    const scripts = await tryRun(`${Deno.cwd()}/${file}`, readJsFiles);
    if (scripts) return scripts;
  }

  for (const file of yamlFiles) {
    const scripts = await tryRun(`${Deno.cwd()}/${file}`, readYamlFiles);
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
