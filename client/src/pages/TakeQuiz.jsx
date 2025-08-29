import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function TakeQuiz(){
  const { id } = useParams();
  const nav = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(`/quizzes/${id}`).then(q => {
      setQuiz(q);
      setAnswers(q.questions.map((qq, i) => ({ questionId: qq.id, selectedIndex: null })));
      setLoading(false);
    }).catch(e => { alert(e.message); setLoading(false); });
  }, [id]);

  if (loading) return <div className="card"><p>Loading...</p></div>;
  if (!quiz) return <div className="card"><p>Quiz not found</p></div>;

  const q = quiz.questions[index];

  const select = (oi) => {
    const next = answers.map(a => a.questionId===q.id ? { ...a, selectedIndex: oi } : a);
    setAnswers(next);
  };

  const nextQ = () => setIndex(i => Math.min(i+1, quiz.questions.length-1));
  const prevQ = () => setIndex(i => Math.max(i-1, 0));

  const submit = async () => {
    try {
      const res = await api(`/quizzes/${id}/submit`, { method:"POST", body:{ answers } });
      nav("/results", { state: res });
    } catch (e) {
      alert(e.message);
    }
  };

  const currentAnswer = answers.find(a => a.questionId===q.id)?.selectedIndex;

  return (
    <div className="card">
      <h1>{quiz.title}</h1>
      <p className="badge">{index+1} / {quiz.questions.length}</p>
      <div className="card" style={{background:"rgba(255,255,255,.02)"}}>
        <h2 className="mb">{q.text}</h2>
        <div className="grid">
          {q.options.map((opt, oi) => (
            <button key={oi}
              onClick={()=>select(oi)}
              className={"btn ghost"}
              style={{borderColor: currentAnswer===oi ? "var(--accent)" : "rgba(255,255,255,.12)"}}>
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div className="flex mt" style={{justifyContent:"space-between"}}>
        <button className="btn ghost" onClick={prevQ} disabled={index===0}>Previous</button>
        {index < quiz.questions.length-1 ? (
          <button className="btn primary" onClick={nextQ}>Next</button>
        ) : (
          <button className="btn success" onClick={submit}>Submit</button>
        )}
      </div>
    </div>
  );
}
