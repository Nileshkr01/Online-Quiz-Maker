import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function CreateQuiz(){
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { text:"", options:["",""], correctIndex:0 }
  ]);
  const addQuestion = () => setQuestions([...questions, { text:"", options:["",""], correctIndex:0 }]);
  const updateQ = (i, patch) => setQuestions(questions.map((q,idx)=> idx===i?{...q, ...patch}:q));
  const updateOpt = (qi, oi, val) => {
    const next = questions.map((q,idx)=>{
      if(idx!==qi) return q;
      const options = q.options.slice();
      options[oi] = val;
      return {...q, options};
    });
    setQuestions(next);
  };
  const addOption = (qi) => {
    const next = questions.map((q,idx)=> idx===qi?{...q, options:[...q.options, ""]}:q);
    setQuestions(next);
  };
  const removeOption = (qi, oi) => {
    const next = questions.map((q,idx)=> {
      if(idx!==qi) return q;
      const options = q.options.slice();
      options.splice(oi,1);
      return {...q, options, correctIndex: Math.min(q.correctIndex, options.length-1)};
    });
    setQuestions(next);
  };
  const submit = async () => {
    try {
      const payload = { title, description, questions };
      const res = await api("/quizzes", { method:"POST", body: payload, auth:true });
      nav(`/quiz/${res.id}`);
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <div className="card">
      <h1>Create a New Quiz</h1>
      <div className="mt">
        <label className="label">Title</label>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g., JavaScript Basics" />
      </div>
      <div className="mt">
        <label className="label">Description</label>
        <textarea className="textarea" rows="3" value={description} onChange={e=>setDescription(e.target.value)} placeholder="What is this quiz about?" />
      </div>

      <h2 className="mt">Questions</h2>
      {questions.map((q, qi) => (
        <div key={qi} className="card" style={{background:"rgba(255,255,255,.02)"}}>
          <label className="label">Question Text</label>
          <input className="input" value={q.text} onChange={e=>updateQ(qi,{text:e.target.value})} placeholder={`Question ${qi+1}`} />
          <div className="mt">
            <label className="label">Options</label>
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex">
                <input className="input" value={opt} onChange={e=>updateOpt(qi, oi, e.target.value)} placeholder={`Option ${oi+1}`} />
                <button className="btn ghost" onClick={()=>removeOption(qi, oi)}>Remove</button>
              </div>
            ))}
            <button className="btn ghost mt" onClick={()=>addOption(qi)}>+ Add Option</button>
          </div>
          <div className="mt">
            <label className="label">Correct Answer</label>
            <select className="select" value={q.correctIndex} onChange={e=>updateQ(qi,{correctIndex:Number(e.target.value)})}>
              {q.options.map((_,oi)=>(<option key={oi} value={oi}>Option {oi+1}</option>))}
            </select>
          </div>
        </div>
      ))}
      <div className="flex mt">
        <button className="btn ghost" onClick={addQuestion}>+ Add Question</button>
        <button className="btn primary" onClick={submit}>Save Quiz</button>
      </div>
      <p className="mt" style={{color:"var(--muted)"}}>Note: You must be logged in to save.</p>
    </div>
  );
}
