// src/App.js
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";

const HomePage = lazy(() => import("./pages/HomePage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const WorldMap = lazy(() => import("./pages/WorldMap"));
const GuessMyNameGame = lazy(() => import("./pages/GuessMyNameGame"));
const IndianMap = lazy(() => import("./pages/IndiaMap"));
const Typing = lazy(() => import("./pages/Typing"));

function App() {
  return (
    <Router>
      <Navbar /> {/* ← top menu always visible */}
      <Suspense fallback={<div>Loading…</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/wmap" element={<WorldMap />} />
          <Route path="/gmng" element={<GuessMyNameGame />} />
          <Route path="/im" element={<IndianMap />} />
          <Route path="/typing" element={<Typing />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
