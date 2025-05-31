// frontend/src/pages/RNASeq.jsx
import React, { useState } from "react";

function RNASeq() {
  const [file, setFile] = useState(null);
  const [volcanoPlot, setVolcanoPlot] = useState("");
  const [heatmap, setHeatmap] = useState("");
  const [topGenes, setTopGenes] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setVolcanoPlot("");
    setHeatmap("");
    setTopGenes([]);

    if (!file) {
      setError("Please upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/rnaseq/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Upload failed");
        return;
      }

      const data = await response.json();
      setVolcanoPlot(data.volcano_plot);
      setHeatmap(data.heatmap);
      setTopGenes(data.top_genes);
    } catch (err) {
      setError("Server error. Is FastAPI running?");
    }
  };

  const downloadTopGenesCSV = () => {
    if (topGenes.length === 0) return;

    const headers = Object.keys(topGenes[0]);
    const rows = topGenes.map((row) => headers.map((h) => row[h]));
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "top_genes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>📈 RNA-Seq Visualizer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" style={{ marginLeft: "1rem" }}>
          Upload
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {volcanoPlot && (
        <>
          <h2>🌋 Volcano Plot</h2>
          <img
            src={`data:image/png;base64,${volcanoPlot}`}
            alt="Volcano Plot"
            style={{ maxWidth: "100%", marginBottom: "0.5rem" }}
          />
          <a
            href={`data:image/png;base64,${volcanoPlot}`}
            download="volcano.png"
            style={{ display: "inline-block", marginBottom: "2rem" }}
          >
            ⬇️ Download Volcano Plot
          </a>
        </>
      )}

      {heatmap && (
        <>
          <h2>🔥 Heatmap</h2>
          <img
            src={`data:image/png;base64,${heatmap}`}
            alt="Heatmap"
            style={{ maxWidth: "100%", marginBottom: "0.5rem" }}
          />
          <a
            href={`data:image/png;base64,${heatmap}`}
            download="heatmap.png"
            style={{ display: "inline-block", marginBottom: "2rem" }}
          >
            ⬇️ Download Heatmap
          </a>
        </>
      )}

      {topGenes.length > 0 && (
        <>
          <h2>🧬 Top Genes</h2>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Gene</th>
                <th>log₂ Fold Change</th>
                <th>p-value</th>
                <th>Significance (–log₁₀p)</th>
              </tr>
            </thead>
            <tbody>
              {topGenes.map((gene, index) => (
                <tr key={index}>
                  <td>{gene.gene}</td>
                  <td>{gene.log2FoldChange}</td>
                  <td>{gene.pvalue}</td>
                  <td>{gene["-log10(pvalue)"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={downloadTopGenesCSV} style={{ marginTop: "1rem" }}>
            ⬇️ Download Top Genes (.csv)
          </button>
        </>
      )}
    </div>
  );
}

export default RNASeq;
