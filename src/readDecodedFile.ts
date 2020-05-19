/**
 * Read decoded text file.
 *
 * @param filename the absolute path to the file.
 */
export async function readDecodedFile(filename: string) {
  const decoder = new TextDecoder();
  const rawFile = await Deno.readFile(filename);
  return decoder.decode(rawFile);
}
