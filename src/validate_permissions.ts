export async function validatePermissions() {
  let readPermissions = await Deno.permissions.query({ name: "read" });
  if (readPermissions.state === "prompt") {
    console.log("Running scripts requires the read permission.");
    readPermissions = await Deno.permissions.request({ name: "read" });
  }

  if (readPermissions.state !== "granted") {
    console.log("You don't seem to trust me :(");
    console.log("flex cannot run without read permissions.");
    Deno.exit();
  }

  let runPermissions = await Deno.permissions.query({ name: "run" });
  if (runPermissions.state === "prompt") {
    console.log("Running scripts requires the run permission.");
    runPermissions = await Deno.permissions.request({ name: "run" });
  }

  if (runPermissions.state !== "granted") {
    console.log("You don't seem to trust me :(");
    console.log("flex cannot run without run permissions.");
    Deno.exit();
  }
}
