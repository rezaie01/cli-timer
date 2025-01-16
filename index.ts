#!/usr/bin/env node
import { Command } from "commander";
import { TOptions } from "./types/types.js";
import { readJsonFile } from "./utils/file.js";
import handleTimer from "./commands/timer.js";

const {
  version: pkgVersion,
  name: pkgName,
}: { version: string; name: string } = await readJsonFile("package.json");

const program = new Command("cmd-timer");

program
  .description("A simple command line timer")
  .option("-v, --version", "output the version number")
  .action((options: { version: boolean }) => {})
  .argument(
    "[time]",
    "The duration of timer can be in formats HH:MM:SS, MM:SS, number of seconds, or e.g. 2h33m10s"
  )
  .option("-h, --hours <number>", "number of hours", (value, _) =>
    Number(value)
  )
  .option("-m, --minutes <number>", "number of minutes", (value, _) =>
    Number(value)
  )
  .option("-s, --seconds <number>", "number of seconds", (value, _) =>
    Number(value)
  )
  .option("--alert", "play a ding sound twice")
  .action((time, options: TOptions) => {
    console.log(options);
    if (options.version) {
      console.log(`${pkgName}: v${pkgVersion}`);
      return process.exit(0);
    }
    
    handleTimer(time, options)
  });

program.parse();


