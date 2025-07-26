# OpenBio Tools 🧬

**OpenBio Tools** is an open-source biology toolkit designed to support inquiry, education, and computational analysis in molecular biology. It provides lightweight, interactive modules that visualize and interpret biological data.

---

## 🚀 Features

### 🔗 Protein-Protein Interaction Explorer  
Submit a human gene symbol (e.g. `TP53`) to render an interaction network via **STRING-db**.  
- Nodes represent proteins; edges reflect interaction confidence scores (color-graded)
- Click any protein to reveal descriptive annotations
- Export graphs as PNGs for publication or presentation use

### 🧪 ORF Translator  
Input raw DNA sequences to identify all six open reading frames (3 forward, 3 reverse).  
Protein translations are derived in real time, allowing rapid inspection of potential coding regions. Ideal for students and researchers examining transcript variants or cloning targets.

### 📊 RNA-Seq Visualizer  
Upload tabular RNA-seq output to generate heatmaps, volcano plots, and expression summaries.  
The module supports gene-level differential analysis and enables exploration of expression profiles without relying on bulky software packages.

### 🧬 CRISPR Guide Picker  
Paste a genomic sequence and retrieve positionally aligned gRNA candidates.  
Each guide is filtered by GC content and predictive on-target score. Supports intelligent design of gene editing constructs with minimal off-target risk.

---

## 🛠️ Tech Stack

- **Frontend**: React, Cytoscape.js, Cytoscape-qtip  
- **Backend**: FastAPI (Python 3.12)  
- **Data Sources**: STRING-db, plaintext genomic data  
- **Deployment**: Vercel (frontend), Render (backend)

---

## 📦 Getting Started

Clone and run the development server:

```bash
git clone https://github.com/SkylarS300/openbio-tools.git
cd openbio-tools
npm install
npm run dev
```

## 🤝 Contributing

OpenBio Tools is actively maintained and expanding. Contributions are welcome, especially in the form of:

- New biological modules  
- Refined UI components  
- Performance and accuracy enhancements  
- Educational overlays and tooltips for classroom use  

Pull requests should be clear, scoped, and purposeful. Explanatory comments are appreciated.

---

## 📄 License

**MIT License** — free to use, adapt, redistribute.  
Attribution is optional but encouraged.

---

## 🧬 About

This project was initiated as a modular platform for biological data exploration.  
It prioritizes both technical transparency and functional elegance. Remains a work in progress on many levels, however; keep this in mind.
