import { Scripts } from "./ScriptsFile.ts";
import { flexArgs } from "./args.ts";
import { readScripts } from "./readScripts.ts";

async function executeScript(script: string) {
  const args = [...script.split(" "), ...(flexArgs.commandArgs || [])];

  return Deno.run({ cmd: [...args] }).status();
}

async function main() {
  const scripts: Scripts = await readScripts();
  if (flexArgs.command in scripts) {
    await executeScript(scripts[flexArgs.command]);
  }
}

if (import.meta.main) {
  await main();
}
