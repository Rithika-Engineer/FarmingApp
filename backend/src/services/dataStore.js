import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

function filePath(name) {
  return path.join(dataDir, `${name}.json`);
}

export async function readData(name, fallback) {
  await ensureDir();
  const p = filePath(name);
  try {
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw);
  } catch {
    await writeData(name, fallback);
    return fallback;
  }
}

export async function writeData(name, data) {
  await ensureDir();
  const p = filePath(name);
  await fs.writeFile(p, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  return data;
}
