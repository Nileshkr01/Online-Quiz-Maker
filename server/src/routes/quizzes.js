import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getQuizzes, saveQuizzes } from "../utils/db.js";

const router = Router();

// List all quizzes (public)
router.get("/", async (req, res) => {
  const quizzes = await getQuizzes();
  const summaries = quizzes.map(({ id, title, description, createdBy, createdAt, questions }) => ({
    id, title, description, createdBy, createdAt, questionCount: questions.length
  }));
  res.json(summaries);
});

// Get single quiz (public - without answers)
router.get("/:id", async (req, res) => {
  const quizzes = await getQuizzes();
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  const { answers, ...rest } = quiz;
  // Remove correct answers from payload
  const sanitized = { ...rest, questions: quiz.questions.map(({ options, correctIndex, ...restQ }) => ({ ...restQ, options })) };
  res.json(sanitized);
});

// Create quiz (auth)
router.post("/", authRequired, async (req, res) => {
  const { title, description, questions } = req.body;
  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Title and at least one question are required" });
  }
  // Validate questions
  for (const q of questions) {
    if (!q.text || !Array.isArray(q.options) || q.options.length < 2 || typeof q.correctIndex !== "number") {
      return res.status(400).json({ error: "Each question needs text, 2+ options, and a correctIndex" });
    }
  }
  const quizzes = await getQuizzes();
  const newQuiz = {
    id: crypto.randomUUID(),
    title,
    description: description || "",
    questions: questions.map((q, i) => ({
      id: `${i+1}`,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex
    })),
    createdBy: req.user.name || req.user.email,
    createdById: req.user.id,
    createdAt: new Date().toISOString()
  };
  quizzes.push(newQuiz);
  await saveQuizzes(quizzes);
  res.status(201).json({ id: newQuiz.id });
});

// Submit answers (public)
router.post("/:id/submit", async (req, res) => {
  const { answers } = req.body; // [{questionId, selectedIndex}]
  const quizzes = await getQuizzes();
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Answers array required" });
  }
  let correct = 0;
  const detailed = quiz.questions.map(q => {
    const given = answers.find(a => String(a.questionId) === String(q.id));
    const selectedIndex = given ? given.selectedIndex : null;
    const isCorrect = selectedIndex === q.correctIndex;
    if (isCorrect) correct += 1;
    return {
      id: q.id,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      selectedIndex,
      isCorrect
    };
  });
  const score = Math.round((correct / quiz.questions.length) * 100);
  res.json({ score, total: quiz.questions.length, correct, detailed, title: quiz.title, description: quiz.description });
});

export default router;
