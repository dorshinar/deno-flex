import { FlexArgs } from "./FlexArgs.ts";

const { args } = Deno;

if (args.length === 0) {
  throw new Error("No command specified!");
}

let commandArgs: string[] | undefined;
if (args.length > 0 && args[1] === "--") {
  commandArgs = args.slice(2);
}

export const flexArgs: FlexArgs = {
  command: args[0],
  commandArgs,
};
