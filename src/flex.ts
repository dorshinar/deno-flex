import { Scripts, FlexArgs } from "./types.ts";
import { parseArgs } from "./args.ts";
import { readScripts } from "./readScripts.ts";

async function executeScript(script: string, args: FlexArgs) {
  const runArgs = [...script.split(" "), ...(args.commandArgs || [])];

  return Deno.run({ cmd: [...runArgs] }).status();
}

async function main() {
  const flexArgs = parseArgs(Deno.args);
  const scripts: Scripts = await readScripts();
  if (flexArgs.command in scripts) {
    await executeScript(scripts[flexArgs.command], flexArgs);
  } else {
    throw new Error("Script not found");
  }
}

if (import.meta.main) {
  await main();
}
