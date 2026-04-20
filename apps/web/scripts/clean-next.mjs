import { rm } from "node:fs/promises";
import { join } from "node:path";

const nextOutputPath = join(process.cwd(), ".next");

await rm(nextOutputPath, { force: true, recursive: true });
