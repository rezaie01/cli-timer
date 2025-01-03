import chalk from "chalk";
import { spawn } from "child_process";
import { Command } from "commander";
const program = new Command("cmd-timer");
program
    .description("A simple command line timer")
    .argument("[time]", "The duration of timer can be in formats HH:MM:SS, MM:SS, number of seconds, or e.g. 2h33m10s")
    .option("-h, --hours <number>", "number of hours")
    .option("-m, --minutes <number>", "number of minutes")
    .option("-s, --seconds <number>", "number of seconds")
    .option("--alert", "play a ding sound twice")
    .action((time, options) => {
    const parsedTime = { h: 0, m: 0, s: 0 };
    if ((time && options.hours) || options.minutes || options.seconds)
        return logError("You cannot use both positional time argument and --hours, --minutes, or --seconds options.");
    if (time) {
        const hhMmSs = parseTimeHHMMSS(time);
        if (!hhMmSs)
            return;
        console.log(chalk.bold("Time Starting: " + new Date().toLocaleString()));
        timer(hhMmSs.h * 3600 + hhMmSs.m * 60 + hhMmSs.s, {
            alert: options.alert,
        });
    }
});
program.parse();
// The timer
async function timer(seconds, options = { alert: false }) {
    if (isNaN(seconds))
        console.error("Invalid number of seconds");
    const start = Date.now();
    const end = start + seconds * 1000;
    await new Promise((resolve) => {
        const interval = setInterval(() => {
            const now = Date.now();
            if (now >= end) {
                clearInterval(interval);
                console.log(`${chalk.blue("Remaining Time: ")}${formatTime(0, 0, 0)}`);
                if (options.alert)
                    playSound();
                resolve(0);
            }
            else {
                const msPassed = now - start;
                let time = seconds - Math.floor(msPassed / 1000);
                const hours = Math.floor(time / 3600);
                time %= 3600;
                const minutes = Math.floor(time / 60);
                // seconds
                time %= 60;
                process.stdout.write(`${chalk.blue("Remaining Time: ")}${formatTime(hours, minutes, time)}\r`);
            }
        }, 1000);
    });
}
function parseTimeHHMMSS(timeStr) {
    let timeObj = {};
    let matchResults = [
        timeStr.match(/^(((?<h>[0-5]?[0-9]):)?((?<m>[0-5]?\d):(?<s>[0-5]?\d)))$/),
        timeStr.match(/^(?<s>\d+)$/),
        timeStr.match(/^(((?<h>\d\d?)h)?((?<m>\d\d?)m)?((?<s>\d\d?)s)?)$/),
    ];
    matchResults.forEach((matchObj) => {
        var _a;
        if (matchObj)
            timeObj = (_a = matchObj.groups) !== null && _a !== void 0 ? _a : {};
    });
    let { h, m, s } = timeObj;
    (h = Number(h)), (m = Number(m)), (s = Number(s));
    if (isNaN(h) && isNaN(m) && isNaN(s)) {
        return logError(`
Invalid time provided.
Please provide the time using the following methods:
  \u2022 hh:mm:ss e.g. 02:00:30
  \u2022 The number of total seconds e.g. (3690)
  \u2022 Provide the hours(h), minutes(m), or seconds(s)
    as in (23h43m2s) or (1h22s) or 23s
  \u2022 You can use the options -h, -m, and -s e.g.

${chalk.bold("Remember that time cannot be negative.")}
            `);
    }
    h = isNaN(h) ? 0 : h;
    m = isNaN(m) ? 0 : m;
    s = isNaN(s) ? 0 : s;
    if (h == 0 && m == 0 && s == 0)
        return logError("Timer will not start because provided time is 0.");
    if (s > 59) {
        m += Math.floor(s / 60);
        s = s % 60;
    }
    if (m > 59) {
        h += Math.floor(m / 60);
        m = m % 60;
    }
    if (h > 23)
        return logError("Time cannot be longer than a day");
    return { h, m, s };
}
function formatTime(hours, minutes, seconds) {
    const seperator = chalk.red(":");
    const h = hours.toString().padStart(2, "0");
    const m = minutes.toString().padStart(2, "0");
    const s = seconds.toString().padStart(2, "0");
    return `${h}${seperator}${m}${seperator}${s}`;
}
function logError(str) {
    console.error(chalk.red(chalk.bold("[error]: ") + str));
}
function playSound() {
    const dingPlay = spawn(`mpg123`, ["ding.mp3"], {
        stdio: "ignore",
        detached: true,
    });
    dingPlay.on("exit", () => {
        spawn(`mpg123`, ["ding.mp3"], { stdio: "ignore", detached: true });
    });
}
