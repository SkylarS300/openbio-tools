# OpenBio Tools 🧬

OpenBio Tools is an open-source biology toolkit built to support learning, exploration, and research. It features interactive visualizations and lightweight analytical tools designed to make molecular biology more accessible. 

### 🚀 Features

- **Protein-Protein Interaction Explorer**  
  Input a human gene (e.g. `TP53`) to visualize known interactions via STRING-db. Explore confidence scores, read protein summaries, and export the network as an image.

- **Coming Soon: ORF Analyzer**  
  Translate gene sequences into open reading frames for downstream bioinformatics work.

- **Planned Modules**  
  RNA-seq visualizer, CRISPR guide picker, and customizable educational overlays.

---

### 🛠️ Tech Stack

- **Frontend:** React, Cytoscape.js, Cytoscape-qtip  
- **Backend:** FastAPI (Python 3.12)  
- **Data Sources:** STRING-db  
- **Deployment:** Vercel (frontend), Render (backend)

---

### 📦 Getting Started

```bash
git clone https://github.com/YOUR-USERNAME/openbio-tools.git
cd openbio-tools
npm install
npm run dev
