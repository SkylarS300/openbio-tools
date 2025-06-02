// src/pages/Index.jsx
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Welcome to OpenBio Tools 🧬</h1>
      <p>This is your bioinformatics playground. Select a tool below to get started:</p>

      <ul style={{ marginTop: "1rem", lineHeight: "2" }}>
        <li><Link to="/crispr">🧬 CRISPR Guide Picker</Link></li>
        <li><Link to="/interactions">🔗 Protein-Protein Interaction Network</Link></li>
        <li><Link to="/orf">🧪 ORF Translator</Link></li>
        <li><Link to="/rnaseq">📊 RNA-Seq Visualizer</Link></li>
      </ul>

      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#555" }}>
        Built with 💻 FastAPI + React
      </p>
    </div>
  );
}

export default Home;
