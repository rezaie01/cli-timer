# cmd-timer

`cmd-timer` is a simple yet powerful command-line timer built with Node.js. It supports multiple time formats, provides customizable options, and can play alert sounds upon completion.

## Features

- Accepts time input in various formats:
  - `HH:MM:SS`
  - `MM:SS`
  - Total seconds (e.g., `3600`)
  - Mixed formats like `2h33m10s`
- Supports optional arguments for specifying hours, minutes, and seconds directly.
- Plays an optional alert sound when the timer finishes.
- Graceful cancellation with remaining time display.

## Installation

```bash
npm install -g cmd-timer
```

## Usage

### Basic Timer

```bash
cmd-timer 2:30
```
Starts a timer for 2 minutes and 30 seconds.

### Specify Time Using Options

```bash
cmd-timer --hours 1 --minutes 15 --seconds 20
```
Starts a timer for 1 hour, 15 minutes, and 20 seconds.

### Play Alert Sound

```bash
cmd-timer 45 --alert
```
Starts a timer for 45 seconds and plays a ding sound twice upon completion.

### Mixed Formats

```bash
cmd-timer 2h45m15s
```
Starts a timer for 2 hours, 45 minutes, and 15 seconds.

### Cancel Timer Gracefully

Press `CTRL+C` to cancel the timer and display the remaining time.

## Options

- `-h, --hours <number>`: Specify the number of hours.
- `-m, --minutes <number>`: Specify the number of minutes.
- `-s, --seconds <number>`: Specify the number of seconds.
- `--alert`: Plays a ding sound twice when the timer ends.

## Examples

### Timer for 1 Hour, 30 Minutes, and 15 Seconds

```bash
cmd-timer 1:30:15
```

### Timer for 90 Seconds

```bash
cmd-timer 90
```

### Timer Using Options

```bash
cmd-timer --hours 0 --minutes 45 --seconds 30
```

## Requirements

- Node.js (>=14.0.0)

## Development

### Clone the Repository

```bash
git clone https://github.com/rezaie01/cli-timer.git
cd cmd-timer
```

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm link
cmd-timer 1:00
```

## License

This project is licensed under the MIT License. 
