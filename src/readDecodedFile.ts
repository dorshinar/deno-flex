/**
 * Read decoded text file.
 *
 * @param filename the absolute path to the file.
 */
export async function readDecodedFile(filename: string) {
  return Deno.readTextFile(filename);
}
