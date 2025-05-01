// src/pages/AboutPage.js
import React from "react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div>
      <h1>About</h1>
      <p>This app highlights continents on a map using React Router.</p>
      <Link to="/">Home</Link>
    </div>
  );
}
