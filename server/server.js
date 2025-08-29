import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
import quizRoutes from "./src/routes/quizzes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Health check
app.get("/", (req, res) => res.json({ ok: true, service: "Quiz Maker API" }));

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
