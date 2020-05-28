import { SupportedFile } from "./../src/types.ts";
import { assertEquals, assertThrowsAsync, path } from "./e2e_deps.ts";

const flexCmd = "flex";

function getCWD(file: string) {
  return path.join(Deno.cwd(), "tests", "test_configs", file);
}

async function runFlex(cmd: string[], cwd: string) {
  const process = Deno.run({
    cmd: [flexCmd, ...cmd],
    cwd,
    stdout: "piped",
    stderr: "piped",
  });

  await process.status();
  process.close();
  return process;
}

function decodeOutput(rawOutput: Uint8Array) {
  const decoder = new TextDecoder();
  return decoder.decode(rawOutput).trim();
}

async function getFlexOutput(cmd: string[], cwd: string) {
  const process = await runFlex(cmd, cwd);

  const rawOutput = await process.output();
  const stderr = decodeOutput(await process.stderrOutput());
  if (stderr) {
    throw new Error(stderr);
  }

  return decodeOutput(rawOutput);
}

const fileExtensions: SupportedFile[] = [
  ".js",
  ".json",
  ".yaml",
  ".yml",
  ".toml",
];
const scripts = ["start", "prod"];

fileExtensions.map((ext) => {
  scripts.map((script) => {
    Deno.test({
      name: `runs ${script} with no arguments from ${ext} file`,
      ignore: ext === ".js" && Deno.build.os == "windows",
      async fn() {
        const output = await getFlexOutput([script], getCWD(ext));
        assertEquals(output, `${script} output`);
      },
    });

    Deno.test({
      name: `runs ${script} with 1 argument from ${ext} file`,
      ignore: ext === ".js" && Deno.build.os == "windows",
      async fn() {
        const args = ["--", "hello"];
        const output = await getFlexOutput([script, ...args], getCWD(ext));
        assertEquals(output, `${script} output hello`);
      },
    });

    Deno.test({
      name: `runs ${script} with arguments not preceded by '--' from ${ext} file`,
      ignore: ext === ".js" && Deno.build.os == "windows",
      async fn() {
        const args = ["hello"];
        const output = await getFlexOutput([script, ...args], getCWD(ext));
        assertEquals(output, `${script} output`);
      },
    });

    Deno.test({
      name: `runs ${script} with multiple arguments from ${ext} file`,
      ignore: ext === ".js" && Deno.build.os == "windows",
      async fn() {
        const args = ["hello", "world"];
        const output = await getFlexOutput(
          [script, "--", ...args],
          getCWD(ext)
        );
        assertEquals(output, `${script} output ${args.join(" ")}`);
      },
    });
  });
});

fileExtensions.map((ext) => {
  Deno.test(`throws when running unknown script from ${ext} file`, async () => {
    const script = "test";
    await assertThrowsAsync(async () => {
      await getFlexOutput([script], getCWD(ext));
    });
  });
});
