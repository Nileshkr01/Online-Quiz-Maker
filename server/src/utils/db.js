import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, "../data");

async function readJson(file) {
  const p = path.join(dataDir, file);
  try {
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

async function writeJson(file, data) {
  const p = path.join(dataDir, file);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(p, JSON.stringify(data, null, 2), "utf-8");
}

export async function getUsers() { return readJson("users.json"); }
export async function saveUsers(users) { return writeJson("users.json", users); }

export async function getQuizzes() { return readJson("quizzes.json"); }
export async function saveQuizzes(quizzes) { return writeJson("quizzes.json", quizzes); }
