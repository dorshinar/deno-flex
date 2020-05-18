import { ScriptsFile } from "./ScriptsFile.ts";
import { flexArgs } from "./args.ts";

async function executeScript(script: string) {
  const args = [...script.split(" "), ...(flexArgs.commandArgs || [])];

  return Deno.run({
    cmd: [...args],
  }).status();
}

async function main() {
  const scriptsFile = await Deno.readTextFile(`${Deno.cwd()}/flex.json`);
  const scripts: ScriptsFile = JSON.parse(scriptsFile);
  if (flexArgs.command in scripts) {
    await executeScript(scripts[flexArgs.command]);
  }
}

if (import.meta.main) {
  await main();
}
