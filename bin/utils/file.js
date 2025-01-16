import { readFile } from "fs/promises";
export async function readJsonFile(filename) {
    const file = await readFile(filename, { encoding: "utf-8" });
    return JSON.parse(file);
}
