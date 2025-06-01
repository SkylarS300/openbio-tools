import React, { useState } from "react";

function CRISPR() {
    const [sequence, setSequence] = useState("");
    const [guides, setGuides] = useState([]);
    const [error, setError] = useState("");
    const [minGC, setMinGC] = useState(40);
    const [maxGC, setMaxGC] = useState(60);


    const fetchGuides = async (e) => {
        e.preventDefault();
        setError("");
        setGuides([]);

        try {
            const response = await fetch("http://localhost:8000/crispr/guides", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sequence, min_gc: minGC, max_gc: maxGC }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.detail || "Something went wrong.");
                return;
            }

            const data = await response.json();
            setGuides(data);
        } catch (err) {
            setError("Failed to reach backend.");
        }
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

                <div style={{ marginTop: "1rem" }}>
                    <label>GC Content Range: {minGC}% – {maxGC}%</label>
                    <br />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={minGC}
                        onChange={(e) => setMinGC(Number(e.target.value))}
                    />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={maxGC}
                        onChange={(e) => setMaxGC(Number(e.target.value))}
                        style={{ marginLeft: "1rem" }}
                    />
                </div>


                <button type="submit" style={{ marginTop: "1rem" }}>
                    Find Guides
                </button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {guides.length > 0 && (
                <div style={{ marginTop: "2rem" }}>
                    <h2>Found {guides.length} Guide(s)</h2>
                    <table style={{ borderCollapse: "collapse", width: "100%" }}>
                        <thead>
                            <tr>
                                <th>Guide</th>
                                <th>Start</th>
                                <th>Strand</th>
                                <th>PAM</th>
                                <th>GC%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guides.map((g, idx) => (
                                <tr key={idx}>
                                    <td><code>{g.guide}</code></td>
                                    <td>{g.start}</td>
                                    <td>{g.strand}</td>
                                    <td>{g.pam}</td>
                                    <td>{g.gc}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CRISPR;
