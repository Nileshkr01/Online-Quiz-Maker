import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Results(){
  const { state } = useLocation();
  if (!state) return <div className="card"><p>No results to show.</p></div>;
  const { score, total, correct, detailed, title } = state;
  return (
    <div className="card">
      <h1>Results: {title}</h1>
      <h2 className="mt">Score: {score}% ({correct}/{total} correct)</h2>
      <div className="mt">
        {detailed.map((d) => (
          <div key={d.id} className="card" style={{background:"rgba(255,255,255,.02)"}}>
            <p><strong>Q{d.id}:</strong> {d.text}</p>
            <ul>
              {d.options.map((opt, i) => (
                <li key={i}>
                  {opt} {i===d.correctIndex ? "✅" : ""} {d.selectedIndex===i && i!==d.correctIndex ? "❌" : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex mt">
        <Link className="btn ghost" to="/quizzes">Back to list</Link>
        <Link className="btn primary" to="/create">Create another quiz</Link>
      </div>
    </div>
  );
}
