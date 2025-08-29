import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUsers, saveUsers } from "../utils/db.js";

dotenv.config();
const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  const users = await getUsers();
  const exists = users.find(u => u.email.toLowerCase() == email.toLowerCase());
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);
  const newUser = { id: crypto.randomUUID(), name, email, password: hash, createdAt: new Date().toISOString() };
  users.push(newUser);
  await saveUsers(users);

  const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
  res.json({ token, user: { id: newUser.id, name, email } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const users = await getUsers();
  const user = users.find(u => u.email.toLowerCase() == email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

export default router;
