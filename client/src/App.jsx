import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import QuizList from "./pages/QuizList.jsx";
import CreateQuiz from "./pages/CreateQuiz.jsx";
import TakeQuiz from "./pages/TakeQuiz.jsx";
import Results from "./pages/Results.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { getToken, setToken, clearToken, apiHost } from "./api.js";

function Navbar(){
  const nav = useNavigate();
  const token = getToken();
  const logout = () => { clearToken(); nav("/"); };
  return (
    <div className="nav">
      <div className="flex">
        <Link className="brand" to="/">Quiz Maker</Link>
        <Link to="/quizzes">Browse</Link>
        {token && <Link to="/create">Create</Link>}
      </div>
      <div className="flex">
        {!token ? (<>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign up</Link>
        </>) : (<>
          <span className="badge">Signed in</span>
          <button className="btn ghost" onClick={logout}>Logout</button>
        </>)}
      </div>
    </div>
  );
}

export default function App(){
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/quiz/:id" element={<TakeQuiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}
