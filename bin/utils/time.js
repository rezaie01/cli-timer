export function secondsToHoursMinutesSeconds(time) {
    const hours = Math.floor(time / 3600);
    time %= 3600;
    const minutes = Math.floor(time / 60);
    // seconds
    time %= 60;
    return { hours, minutes, seconds: time };
}
