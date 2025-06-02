import React, { useState } from "react";

function CRISPR() {
    const [sequence, setSequence] = useState("");
    const [guides, setGuides] = useState([]);
    const [filteredGuides, setFilteredGuides] = useState([]);
    const [error, setError] = useState("");
    const [minGC, setMinGC] = useState(40);
    const [maxGC, setMaxGC] = useState(60);
    const [minScore, setMinScore] = useState(0);
    const [sortBy, setSortBy] = useState("score"); // new

    const fetchGuides = async (e) => {
        e.preventDefault();
        setError("");
        setGuides([]);
        setFilteredGuides([]);

        try {
            const response = await fetch("http://localhost:8000/crispr/guides", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sequence,
                    min_gc: minGC,
                    max_gc: maxGC,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.detail || "Something went wrong.");
                return;
            }

            const data = await response.json();
            setGuides(data);
            applyFilters(data);
        } catch (err) {
            setError("Failed to reach backend.");
        }
    };

    const applyFilters = (guides) => {
        let filtered = guides.filter((g) => g.score >= minScore);
        switch (sortBy) {
            case "score":
                filtered.sort((a, b) => b.score - a.score);
                break;
            case "start":
                filtered.sort((a, b) => a.start - b.start);
                break;
            case "gc":
                filtered.sort((a, b) => b.gc - a.gc);
                break;
            default:
                break;
        }
        setFilteredGuides(filtered);
    };

    return (
        <div style={{ padding: "2rem", fontFamily: "Arial" }}>
            <h1>🧬 CRISPR Guide Picker</h1>
            <form onSubmit={fetchGuides}>
                <textarea
                    value={sequence}
                    onChange={(e) => setSequence(e.target.value)}
                    rows={6}
                    cols={60}
                    placeholder="Paste DNA sequence here (A, T, C, G only)"
                    style={{ fontFamily: "monospace", fontSize: "1rem", width: "100%" }}
                />
                <br />

                <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                    <label style={{ minWidth: "180px" }}>GC Content Range: {minGC}% – {maxGC}%</label>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={minGC}
                        onChange={(e) => setMinGC(Number(e.target.value))}
                        style={{ flex: 1 }}
                    />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={maxGC}
                        onChange={(e) => setMaxGC(Number(e.target.value))}
                        style={{ flex: 1 }}
                    />
                </div>


                <div style={{ marginTop: "1rem" }}>
                    <label>Minimum Score: {minScore}</label>
                    <br />
                    <input
                        type="number"
                        value={minScore}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        min={0}
                        max={100}
                        style={{ width: "100px" }}
                    />
                </div>

                <div style={{ marginTop: "1rem" }}>
                    <label>Sort By:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            applyFilters(guides);
                        }}
                        style={{ marginLeft: "1rem" }}
                    >
                        <option value="score">Score (Descending)</option>
                        <option value="start">Start Position (Ascending)</option>
                        <option value="gc">GC% (Descending)</option>
                    </select>
                </div>

                <button type="submit" style={{ marginTop: "1rem" }}>
                    Find Guides
                </button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {filteredGuides.length > 0 && (
                <div style={{ marginTop: "2rem" }}>
                    <h2>Showing {filteredGuides.length} Guide(s) with score ≥ {minScore}</h2>
                    <button
                        onClick={() => downloadCSV(filteredGuides)}
                        style={{ marginBottom: "1rem" }}
                    >
                        📄 Export as CSV
                    </button>

                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "1rem",
                    fontSize: "0.95rem"
                }}>
                    <thead style={{ backgroundColor: "#f2f2f2" }}>
                        <tr>
                            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Guide</th>
                            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Start</th>
                            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Strand</th>
                            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>PAM</th>
                            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>GC%</th>
                            <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGuides.map((g, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: "0.5rem", border: "1px solid #ccc", fontFamily: "monospace" }}><code>{g.guide}</code></td>
                                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{g.start}</td>
                                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{g.strand}</td>
                                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{g.pam}</td>
                                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{g.gc}%</td>
                                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{g.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
)}
        </div >
    );
}

function downloadCSV(data) {
    const headers = ["Guide", "Start", "Strand", "PAM", "GC%", "Score"];
    const rows = data.map((g) => [
        g.guide,
        g.start,
        g.strand,
        g.pam,
        g.gc,
        g.score,
    ]);

    const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "crispr_guides.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


export default CRISPR;
