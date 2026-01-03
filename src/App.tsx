import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { initAuthNavigation } from "../firebase";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = initAuthNavigation((path) => navigate(path));
    return () => unsub();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
