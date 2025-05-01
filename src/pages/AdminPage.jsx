// src/pages/AdminPage.js
import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminPage() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
      <br />
      <Link to="/">Home</Link>
    </div>
  );
}
