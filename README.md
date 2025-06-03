# 🧬 OpenBio Tools

**OpenBio Tools** is an open-source biology toolkit designed for students, educators, and researchers. It features interactive visualizations and lightweight analytical tools that make molecular biology more accessible, hands-on, and intuitive.

---

## 🚀 Live Features

### 🔗 Protein-Protein Interaction Explorer
- Input a human gene (e.g. `TP53`) to visualize known interactions using **STRING-db**
- Interactive Cytoscape.js network with:
  - Color-coded edges by confidence score
  - Node descriptions and tooltips
  - STRING-db linkouts
  - Export as PNG
  - Highlight on selection

### 🧪 ORF Translator
- Paste a DNA sequence to visualize all 6 open reading frames
- Translated amino acid chains for each frame
- Highlights valid ORFs (start→stop codons)
- Useful for gene model inspection and primer design

### 📊 RNA-Seq Visualizer
- Upload expression datasets (e.g. log2FC values, p-values)
- View gene-wise plots including:
  - Volcano plots
  - Expression bar charts
  - Gene detail views
- Ideal for quick analysis of DE genes

### 🧬 CRISPR Guide Picker
- Paste a DNA sequence to scan for gRNA targets
- Detects PAM sequences (NGG), computes:
  - GC content
  - Off-target potential (basic filtering)
  - Positioning and orientation
- Results table with export and filtering tools

---

## 🛠️ Tech Stack

| Layer     | Stack                                     |
|-----------|-------------------------------------------|
| Frontend  | React, Cytoscape.js, cytoscape-qtip       |
| Backend   | FastAPI (Python 3.12)                     |
| Data APIs | [STRING-db](https://string-db.org)        |
| Deploy    | Vercel (frontend), Render (backend)       |

---

## 📦 Getting Started

```bash
git clone https://github.com/SkylarS300/openbio-tools.git
cd openbio-tools
npm install
npm run dev
