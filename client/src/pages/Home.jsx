import React from "react";
import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div className="card">
      <h1>Welcome to Online Quiz Maker</h1>
      <p className="mb">Create quizzes, take quizzes, and see your results. It works great on mobile too!</p>
      <div className="flex">
        <Link to="/quizzes" className="btn ghost">Take a Quiz</Link>
        <Link to="/create" className="btn primary">Create a Quiz</Link>
      </div>
    </div>
  );
}
