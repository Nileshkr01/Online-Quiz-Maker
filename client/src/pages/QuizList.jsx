import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function QuizList(){
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    api("/quizzes").then(setList).catch(e => console.error(e));
  }, []);
  const filtered = list.filter(item => (item.title+item.description).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="card">
      <div className="flex" style={{justifyContent:"space-between", alignItems:"center"}}>
        <h1>Available Quizzes</h1>
        <input className="input" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} style={{maxWidth:280}}/>
      </div>
      <div className="grid mt">
        {filtered.map(qz => (
          <div key={qz.id} className="card">
            <h2>{qz.title}</h2>
            <p>{qz.description}</p>
            <div className="flex">
              <span className="badge">{qz.questionCount} questions</span>
              <Link className="btn primary" to={`/quiz/${qz.id}`}>Take Quiz</Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p>No quizzes yet. Be the first to <Link to="/create">create one</Link>!</p>}
      </div>
    </div>
  );
}
