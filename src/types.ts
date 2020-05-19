/**
 * Scripts object. Keys represent script name, values represent script to run.
 */
export type Scripts = Record<string, string>;

/**
 * File reading function.
 *
 * @param file an absolute file path to read.
 * @returns A promise wrapping a Scripts object, or undefined if file was not found.
 * @see Scripts
 */
export type FileReadFn = (file: string) => Promise<Scripts | undefined>;

/**
 * Arguments to flex executable.
 *
 * @param command command to run.
 * @param commandArgs (optional) arguments passed to executed script.
 */
export interface FlexArgs {
  command: string;
  commandArgs?: string[];
}
