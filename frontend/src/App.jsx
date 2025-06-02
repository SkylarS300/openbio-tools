import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import BioTool1 from "./pages/BioTool1";
import Home from "./pages/Index";
import RNASeq from "./pages/RNASeq";
import Interactions from "./pages/Interactions";
import CRISPR from "./pages/CRISPR";

function NavLink({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: isActive ? "#0056b3" : "#333",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        backgroundColor: isActive ? "#e3f2fd" : "transparent",
        transition: "all 0.2s ease-in-out"
      }}
    >
      {label}
    </Link>
  );
}

// Need a wrapper to let NavLink access useLocation (Router must wrap it)
function Layout() {
  return (
    <>
      <div style={{ padding: "1rem", backgroundColor: "#f0f0f0", marginBottom: "2rem" }}>
        <div style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "1rem 2rem",
          borderRadius: "0 0 12px 12px",
          position: "sticky",
          top: 0,
          zIndex: 1000
        }}>
          <nav style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}>
            <NavLink to="/" label="🏠 Home" />
            <NavLink to="/orf" label="🧪 ORF" />
            <NavLink to="/rnaseq" label="📊 RNA-Seq" />
            <NavLink to="/interactions" label="🔗 Interactions" />
            <NavLink to="/crispr" label="🧬 CRISPR" />
          </nav>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orf" element={<BioTool1 />} />
        <Route path="/rnaseq" element={<RNASeq />} />
        <Route path="/interactions" element={<Interactions />} />
        <Route path="/crispr" element={<CRISPR />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
