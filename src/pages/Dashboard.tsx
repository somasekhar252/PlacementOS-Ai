import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "../../firebase";

export default function Dashboard() {
  const navigate = useNavigate();

  const onSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch {
      // ignore
    }
  };

  const user = auth.currentUser;

  return (
    <div className="center">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Welcome{user?.email ? `, ${user.email}` : ""}</p>
        <div className="actions">
          <button onClick={onSignOut}>Sign out</button>
        </div>
      </div>
    </div>
  );
}
