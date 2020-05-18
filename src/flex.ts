if (import.meta.main) {
  const [command] = Deno.args;
  const scriptsPath = `${Deno.cwd()}/scripts`;

  for await (const dirEntry of Deno.readDir(scriptsPath)) {
    if (dirEntry.isFile && dirEntry.name.split(".")[0] === command) {
      await Deno.run({
        cmd: ["deno", "run", `${scriptsPath}/${dirEntry.name}`],
      }).status();
      break;
    }
  }
}
