import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signUpUser } from "../../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await loginUser(email, pass);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  const onSignup = async () => {
    setError(null);
    try {
      await signUpUser(email, pass);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    }
  };

  return (
    <div className="center">
      <form onSubmit={onLogin} className="card">
        <h2>Sign in</h2>
        {error && <div className="error">{error}</div>}
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        <div className="actions">
          <button type="submit">Login</button>
          <button type="button" onClick={onSignup}>Create account</button>
        </div>
      </form>
    </div>
  );
}
