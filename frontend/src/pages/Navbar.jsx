// frontend/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "1rem",
            borderBottom: "1px solid #ddd",
            backgroundColor: "#f0f0f0",
            fontFamily: "Arial, sans-serif",
        }}>
            <Link to="/">Home</Link>
            <Link to="/crispr">CRISPR</Link>
            <Link to="/interactions">Interactions</Link>
            <Link to="/orf">ORF</Link>
            <Link to="/rnaseq">RNA-Seq</Link>
        </nav>
    );
}
