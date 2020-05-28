import { assertEquals, assertThrowsAsync, path } from "./e2e_deps.ts";

console.log(
  "Starting to run tests...",
  JSON.stringify({ cwd: Deno.cwd() }, null, 2)
);

const flexCmd = "flex";

function getCWD(file: string) {
  return path.join(Deno.cwd(), "tests", "test_configs", file);
}

async function runFlex(cmd: string[], cwd: string) {
  for await (const dir of Deno.readDir(cwd)) {
    console.log(JSON.stringify(dir, null, 2));
  }
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

const fileExtensions = ["js", "json", "yaml", "yml", "toml"];
const scripts = ["start", "prod"];

scripts.map((script) =>
  fileExtensions.map((ext) => {
    Deno.test(`runs ${script} with no arguments from ${ext} file`, async () => {
      const output = await getFlexOutput([script], getCWD(ext));
      assertEquals(output, `${script} output`);
    });

    Deno.test(`runs ${script} with 1 argument from ${ext} file`, async () => {
      const args = ["--", "hello"];
      const output = await getFlexOutput([script, ...args], getCWD(ext));
      assertEquals(output, `${script} output hello`);
    });

    Deno.test(
      `runs ${script} with arguments not preceded by '--' from ${ext} file`,
      async () => {
        const args = ["hello"];
        const output = await getFlexOutput([script, ...args], getCWD(ext));
        assertEquals(output, `${script} output`);
      }
    );

    Deno.test(
      `runs ${script} with multiple arguments from ${ext} file`,
      async () => {
        const args = ["hello", "world"];
        const output = await getFlexOutput(
          [script, "--", ...args],
          getCWD(ext)
        );
        assertEquals(output, `${script} output ${args.join(" ")}`);
      }
    );
  })
);

fileExtensions.map((ext) => {
  Deno.test(`throws when running unknown script from ${ext} file`, async () => {
    const script = "test";
    await assertThrowsAsync(async () => {
      await getFlexOutput([script], getCWD(ext));
    });
  });
});
