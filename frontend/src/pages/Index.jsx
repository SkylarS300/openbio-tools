// src/pages/Index.jsx
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to OpenBio Tools 🧬</h1>
      <p>This is your bioinformatics playground. Select a tool below to get started:</p>

      <ul className="tool-list">
        <li><Link to="/crispr">🧬 CRISPR Guide Picker</Link></li>
        <li><Link to="/interactions">🔗 Protein-Protein Interaction Network</Link></li>
        <li><Link to="/orf">🧪 ORF Translator</Link></li>
        <li><Link to="/rnaseq">📊 RNA-Seq Visualizer</Link></li>
      </ul>

      <p className="read-the-docs">
        Built with 💻 FastAPI + React
      </p>
    </div>
  );
}

export default Home;
