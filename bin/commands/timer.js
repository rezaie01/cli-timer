import chalk from "chalk";
import { formatTime, logError, playSound } from "../utils/output.js";
import { secondsToHoursMinutesSeconds } from "../utils/time.js";
export default function handleTimer(time, options) {
    if (time && (options.hours || options.minutes || options.seconds)) {
        logError("You cannot use both positional time argument and --hours, --minutes, or --seconds options.");
        return;
    }
    let hhMmSs = undefined;
    if (time) {
        hhMmSs = parseTimeHHMMSS(time);
    }
    else {
        hhMmSs = parseTimeHHMMSS(options);
    }
    if (!hhMmSs)
        return;
    console.log(chalk.bold("Time Starting: " +
        new Date().toLocaleString() +
        ` | Duration: ${formatTime(hhMmSs.h, hhMmSs.m, hhMmSs.s)}`));
    timer(hhMmSs.h * 3600 + hhMmSs.m * 60 + hhMmSs.s, {
        alert: options.alert,
    });
}
async function timer(secs, options = { alert: false }) {
    if (isNaN(secs))
        console.error("Invalid number of seconds");
    const start = Date.now();
    const end = start + secs * 1000;
    process.on("SIGINT", () => {
        const msPassed = Date.now() - start;
        let time = secs - Math.floor(msPassed / 1000);
        var { hours, minutes, seconds } = secondsToHoursMinutesSeconds(time);
        process.stdout.write(`${chalk.blue("Remaining Time: ")}${formatTime(hours, minutes, seconds)}`);
        console.log(chalk.yellow(`\nCanceling the timer`));
        process.exit(0);
    });
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
                let time = secs - Math.floor(msPassed / 1000);
                var { hours, minutes, seconds } = secondsToHoursMinutesSeconds(time);
                process.stdout.write(`${chalk.blue("Remaining Time: ")}${formatTime(hours, minutes, seconds)}\r`);
            }
        }, 1000);
    });
}
function parseTimeHHMMSS(timeStr) {
    let { h, m, s } = typeof timeStr === "object"
        ? { h: timeStr.hours, m: timeStr.minutes, s: timeStr.seconds }
        : {};
    if (typeof timeStr === "string") {
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
        ({ h, m, s } = timeObj);
    }
    (h = Number(h)), (m = Number(m)), (s = Number(s));
    if (isNaN(h) && isNaN(m) && isNaN(s)) {
        logError(`
Invalid time provided.
Please provide the time using the following methods:
  \u2022 hh:mm:ss e.g. 02:00:30
  \u2022 The number of total seconds e.g. (3690)
  \u2022 Provide the hours(h), minutes(m), or seconds(s)
    as in (23h43m2s) or (1h22s) or 23s
  \u2022 You can use the options -h, -m, and -s e.g.

${chalk.bold("Remember that time cannot be negative.")}
            `);
        return;
    }
    h = isNaN(h) ? 0 : h;
    m = isNaN(m) ? 0 : m;
    s = isNaN(s) ? 0 : s;
    if (h == 0 && m == 0 && s == 0) {
        logError("Timer will not start because provided time is 0.");
        return;
    }
    if (s > 59) {
        m += Math.floor(s / 60);
        s = s % 60;
    }
    if (m > 59) {
        h += Math.floor(m / 60);
        m = m % 60;
    }
    if (h > 23) {
        logError("Time cannot be longer than a day");
        return;
    }
    return { h, m, s };
}
