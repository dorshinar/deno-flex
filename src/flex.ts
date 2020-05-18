import { flexArgs } from "./args.ts";

const scriptsPath = `${Deno.cwd()}/scripts`;

async function executeScript(filePath: string) {
  return Deno.run({
    cmd: ["deno", "run", filePath, ...(flexArgs.commandArgs || [])],
  }).status();
}

async function main() {
  for await (const dirEntry of Deno.readDir(scriptsPath)) {
    const fileNameWithoutExtension = dirEntry.name.split(".")[0];
    if (dirEntry.isFile && fileNameWithoutExtension === flexArgs.command) {
      await executeScript(`${scriptsPath}/${dirEntry.name}`);
      break;
    }
  }
}

if (import.meta.main) {
  await main();
}
