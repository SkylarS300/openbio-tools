// frontend/src/pages/BioTool1.jsx
import React, { useState } from "react";

function BioTool1() {
    const [sequence, setSequence] = useState("");
    const [minLength, setMinLength] = useState(30); // 👈 new state
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setResults([]);
    setError("");

    const response = await fetch("http://127.0.0.1:8000/analyze_orf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sequence, min_length: minLength }), // 👈 include minLength
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.detail || "Something went wrong");
      return;
    }

    const data = await response.json();
    setResults(data);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🧬 Bioinformatics Assistant</h1>
<form onSubmit={handleSubmit}>
  <label>
    Minimum ORF Length:
    <input
      type="number"
      value={minLength}
      onChange={(e) => setMinLength(parseInt(e.target.value))}
      min="0"
      style={{ margin: "0 1rem" }}
    />
    amino acids
  </label>

  <br /><br />

  <textarea
    value={sequence}
    onChange={(e) => setSequence(e.target.value)}
    placeholder="Paste your DNA sequence here (e.g. ATGGCC...)"
    rows={6}
    style={{ width: "100%", marginBottom: "1rem", fontFamily: "monospace" }}
  />
  <button type="submit">Analyze ORFs</button>
</form>


      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>🧾 Results</h2>
          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Frame</th>
                <th>Direction</th>
                <th>Start</th>
                <th>End</th>
                <th>Protein</th>
              </tr>
            </thead>
            <tbody>
              {results.map((orf, index) => (
                <tr key={index}>
                  <td>{orf.frame}</td>
                  <td>{orf.direction}</td>
                  <td>{orf.start}</td>
                  <td>{orf.end}</td>
                  <td style={{ fontFamily: "monospace" }}>{orf.protein}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BioTool1;
