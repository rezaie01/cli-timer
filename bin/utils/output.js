import chalk from "chalk";
import path from "path";
import soundPlayer from "play-sound";
export function formatTime(hours, minutes, seconds) {
    const seperator = chalk.red(":");
    const h = hours.toString().padStart(2, "0");
    const m = minutes.toString().padStart(2, "0");
    const s = seconds.toString().padStart(2, "0");
    return `${h}${seperator}${m}${seperator}${s}`;
}
export function logError(str) {
    console.error(chalk.red(chalk.bold("[error]: ") + str));
}
export function playSound() {
    const sound = path.join(import.meta.dirname.split("/bin")[0], "ding.mp3");
    const player = soundPlayer();
    player.play(sound, (_) => {
        player.play(sound);
    });
}
