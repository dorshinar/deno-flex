import { FlexArgs } from "./FlexArgs.ts";

const { args } = Deno;

/**
 * If no argument is specified, throw an error
 */
if (args.length === 0) {
  throw new Error("No command specified!");
}

/**
 * Any argument passed after "--" will be passed on to the executed command.
 * For example:
 * $ flex start -- Hello
 * Will run the "start" script, and pass "Hello" as the first argument.
 */
let commandArgs: string[] | undefined;
if (args.length > 0 && args[1] === "--") {
  commandArgs = args.slice(2);
}

export const flexArgs: FlexArgs = {
  command: args[0],
  commandArgs,
};
