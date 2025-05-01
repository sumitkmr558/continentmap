import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main style={{ padding: 20 }}>
        <Outlet /> {/* child routes render here */}
      </main>
    </>
  );
}
