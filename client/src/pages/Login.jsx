import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, setToken } from "../api.js";

export default function Login(){
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = async () => {
    try {
      const res = await api("/auth/login", { method:"POST", body:{ email, password } });
      setToken(res.token);
      nav("/");
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <div className="card">
      <h1>Login</h1>
      <label className="label">Email</label>
      <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
      <label className="label mt">Password</label>
      <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
      <div className="flex mt">
        <button className="btn primary" onClick={submit}>Login</button>
        <Link to="/register" className="btn ghost">Create account</Link>
      </div>
    </div>
  );
}
