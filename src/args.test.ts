import { FlexArgs } from "./types.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { assertThrows } from "./test_deps.ts";
import { parseArgs } from "./args.ts";

Deno.test("throws when args is not an array", () => {
  assertThrows(() => parseArgs(6 as any));
  assertThrows(() => parseArgs(null as any));
  assertThrows(() => parseArgs(undefined as any));
  assertThrows(() => parseArgs("undefined" as any));
});

Deno.test("throws when args is an empty array", () => {
  assertThrows(() => parseArgs([]));
});

Deno.test("returns command with no commandArgs", () => {
  const command = "start";
  const expected = { command: "start" };

  assertEquals(parseArgs([command]), expected);
});

Deno.test("disregards commandArgs if not preceded by '--'", () => {
  const command = "start";
  const expected = { command: "start" };

  assertEquals(parseArgs([command, "hello"]), expected);
});

Deno.test("return command with a single commandArgs", () => {
  const args = ["start", "--", "Hello"];
  const expected: FlexArgs = {
    command: "start",
    commandArgs: ["Hello"],
  };

  assertEquals(parseArgs(args), expected);
});

Deno.test("return command with a multiple commandArgs", () => {
  const args = ["start", "--", "Hello", "World"];
  const expected: FlexArgs = {
    command: "start",
    commandArgs: ["Hello", "World"],
  };

  assertEquals(parseArgs(args), expected);
});
