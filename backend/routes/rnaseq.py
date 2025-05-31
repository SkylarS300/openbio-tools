# backend/routes/rnaseq.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import io
import base64
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

router = APIRouter()

@router.post("/rnaseq/upload")
def upload_rnaseq(file: UploadFile = File(...)):
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")
    try:
        contents = file.file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to parse CSV file.")

    # Validate expected columns
    required_columns = {"gene", "log2FoldChange", "pvalue"}
    if not required_columns.issubset(df.columns):
        raise HTTPException(status_code=400, detail=f"CSV must contain columns: {required_columns}")

    # Volcano Plot
    plt.figure(figsize=(8,6))
    df["-log10(pvalue)"] = -np.log10(df["pvalue"])
    sns.scatterplot(
        data=df,
        x="log2FoldChange",
        y="-log10(pvalue)",
        hue=(df["pvalue"] < 0.05).map({True: "Significant", False: "Not Significant"})
    )
    plt.title("Volcano Plot: Differential Expression")
    plt.xlabel("log₂ Fold Change")
    plt.ylabel("–log₁₀(p-value)")
    buf_volcano = io.BytesIO()
    plt.savefig(buf_volcano, format="png", bbox_inches="tight")
    plt.close()
    buf_volcano.seek(0)
    volcano_b64 = base64.b64encode(buf_volcano.read()).decode("utf-8")

    # Heatmap
    top_genes = df.nsmallest(20, "pvalue").set_index("gene")
    heat_data = top_genes.sort_values("log2FoldChange")  # ⬅️ Sort by logFC for visual clarity
    plt.figure(figsize=(6, 8))
    sns.heatmap(heat_data, annot=True, cmap="coolwarm", center=0)
    plt.title("Top 20 Differentially Expressed Genes")
    buf_heatmap = io.BytesIO()
    plt.savefig(buf_heatmap, format="png", bbox_inches="tight")
    plt.close()
    buf_heatmap.seek(0)
    heatmap_b64 = base64.b64encode(buf_heatmap.read()).decode("utf-8")

    return JSONResponse({
        "volcano_plot": volcano_b64,
        "heatmap": heatmap_b64,
        "top_genes": top_genes.reset_index().head(10).to_dict(orient="records")
    })
