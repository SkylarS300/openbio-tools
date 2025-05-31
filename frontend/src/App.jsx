import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BioTool1 from "./pages/BioTool1";
import Home from "./pages/Index"; // adjust if different
import RNASeq from "./pages/RNASeq"; // adjust if different
import Interactions from "./pages/Interactions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/rnaseq" element={<RNASeq />} />
        <Route path="/" element={<Home />} />
        <Route path="/orf" element={<BioTool1 />} />
        <Route path="/interactions" element={<Interactions />} />
      </Routes>
    </Router>
  );
}

export default App;
