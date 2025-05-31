import React, { useState, useRef, useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import qtip from "cytoscape-qtip";

cytoscape.use(qtip);

function Interactions() {
    const [gene, setGene] = useState("");
    const [elements, setElements] = useState([]);
    const [error, setError] = useState("");
    const [selectedNode, setSelectedNode] = useState(null);
    const cyRef = useRef(null);

    const fetchInteractions = async (e) => {
        e.preventDefault();
        setError("");
        setElements([]);
        setSelectedNode(null);

        if (!gene.trim()) {
            setError("Please enter a gene symbol.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/interactions/fetch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gene }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.detail || "Failed to fetch interactions.");
                return;
            }

            const data = await response.json();
            const cyElements = [
                ...data.nodes.map((n) => ({ data: { id: n.id, label: n.label, description: n.description || "" } })),
                ...data.edges.map((e) => ({
                    data: {
                        source: e.source,
                        target: e.target,
                        score: e.score,
                        label: e.score?.toFixed ? e.score.toFixed(2) : e.label || "0.00",
                    },
                })),
            ];

            setElements(cyElements);
        } catch (err) {
            setError("Server error. Is FastAPI running?");
        }
    };

    return (
        <div style={{ padding: "2rem", fontFamily: "Arial" }}>
            <h1>🔗 Protein Interaction Network</h1>
            <form onSubmit={fetchInteractions}>
                <input
                    type="text"
                    value={gene}
                    onChange={(e) => setGene(e.target.value)}
                    placeholder="Enter gene symbol (e.g. TP53)"
                />
                <button type="submit" style={{ marginLeft: "1rem" }}>
                    Search
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {elements.length > 0 && (
                <div style={{ marginTop: "2rem", border: "1px solid #ccc" }}>
                    <CytoscapeComponent
                        cy={(cy) => {
                            cyRef.current = cy;
                            cy.on("tap", "node", (event) => {
                                const node = event.target;
                                setSelectedNode({
                                    id: node.id(),
                                    label: node.data("label"),
                                    description: node.data("description")
                                });
                            });
                        }}
                        elements={elements}
                        style={{ width: "100%", height: "500px" }}
                        layout={{
                            name: "cose",
                            animate: true,
                            padding: 10,
                            fit: true,
                            nodeRepulsion: 100000,
                            idealEdgeLength: 100,
                            edgeElasticity: 0.1,
                        }}
                        stylesheet={[
                            {
                                selector: "node",
                                style: {
                                    content: "data(label)",
                                    backgroundColor: "#70a1ff",
                                    textValign: "center",
                                    color: "#fff",
                                    fontSize: 10,
                                    width: 25,
                                    height: 25
                                },
                            },
                            {
                                selector: "edge",
                                style: {
                                    label: "data(label)",
                                    width: "mapData(score, 0.7, 1.0, 1, 3)",
                                    fontSize: 7,
                                    lineColor: "mapData(score, 0.7, 1.0, #ffa07a, #00ffcc)",
                                    opacity: "mapData(score, 0.7, 1.0, 0.2, 0.85)",
                                    color: "#ccc",
                                    curveStyle: "bezier",
                                    textMarginY: -3,
                                },
                            }
                        ]}
                    />
                    <div style={{ marginTop: "1rem" }}>
                        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#ccc" }}>
                            Edge Color Legend (Confidence Score)
                        </p>
                        <div style={{
                            height: "10px",
                            background: "linear-gradient(to right, #ffa07a, #00ffcc)",
                            borderRadius: "5px"
                        }} />
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.75rem",
                            color: "#aaa",
                            marginTop: "0.25rem"
                        }}>
                            <span>Low Confidence (0.70)</span>
                            <span>High Confidence (1.00)</span>
                        </div>
                    </div>

                    {selectedNode && (
                        <div style={{
                            marginTop: "1rem",
                            padding: "1rem",
                            background: "#1a1a1a",
                            borderRadius: "8px",
                            color: "#eee",
                            textAlign: "left"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3 style={{ margin: 0 }}>{selectedNode.label}</h3>
                                <button
                                    onClick={() => setSelectedNode(null)}
                                    style={{
                                        marginLeft: "1rem",
                                        fontSize: "0.8rem",
                                        padding: "0.2rem 0.5rem",
                                        background: "#333",
                                        color: "#ccc",
                                        border: "1px solid #555",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                            <p style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
                                {selectedNode.description || "No description available."}
                            </p>
                            <a
                                href={`https://string-db.org/network/${selectedNode.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-block",
                                    marginTop: "0.5rem",
                                    fontSize: "0.85rem",
                                    color: "#4ea1ff",
                                    textDecoration: "underline"
                                }}
                            >
                                🔗 View in STRING-db
                            </a>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            const png = cyRef.current.png({ full: true, scale: 2 });
                            const link = document.createElement("a");
                            link.href = png;
                            link.download = `${gene}_network.png`;
                            link.click();
                        }}
                        style={{ marginTop: "1rem" }}
                    >
                        ⬇️ Download PNG
                    </button>
                </div>
            )}
        </div>
    );
}

export default Interactions;
