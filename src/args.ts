import { FlexArgs } from "./types.ts";

/**
 * Parse arguments. If args is not an array, or not an array an error is thrown.
 * Command name must be separated from the command arguments with "--":
 * $ flex start -- Hello
 *
 * @param args arguments to parse
 * @returns parsed arguments.
 */
export function parseArgs(args: unknown): FlexArgs {
  if (!Array.isArray(args) || args.length === 0) {
    throw new Error("No command specified!");
  }

  let commandArgs: string[] | undefined;
  if (args.length > 0 && args[1] === "--") {
    commandArgs = args.slice(2);
  }

  return {
    command: args[0],
    commandArgs,
  };
}
