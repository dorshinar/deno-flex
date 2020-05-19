import { parseYaml, parseToml } from "./deps.ts";
import { Scripts } from "./types.ts";
import { readDecodedFile } from "./readDecodedFile.ts";
import { FileReadFn } from "./types.ts";

export const readJsonFiles: FileReadFn = async (file) => {
  const scriptsFile = await readDecodedFile(file);
  return JSON.parse(scriptsFile);
};

export const readJsFiles: FileReadFn = async (file) => {
  const scriptsFile = await import(file);
  return scriptsFile.default;
};

export const readYamlFiles: FileReadFn = async (file) => {
  const rawFile = await readDecodedFile(file);
  return parseYaml(rawFile) as Scripts;
};

export const readTomlFiles: FileReadFn = async (file) => {
  const rawFile = await readDecodedFile(file);
  return parseToml(rawFile) as Scripts;
};
