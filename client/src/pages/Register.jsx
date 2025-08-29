import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, setToken } from "../api.js";

export default function Register(){
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = async () => {
    try {
      const res = await api("/auth/register", { method:"POST", body:{ name, email, password } });
      setToken(res.token);
      nav("/");
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <div className="card">
      <h1>Create Account</h1>
      <label className="label">Name</label>
      <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
      <label className="label mt">Email</label>
      <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
      <label className="label mt">Password</label>
      <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a password" />
      <div className="flex mt">
        <button className="btn primary" onClick={submit}>Sign up</button>
        <Link to="/login" className="btn ghost">Have an account? Login</Link>
      </div>
    </div>
  );
}
