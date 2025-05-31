# backend/utils/bio.py

from Bio.Seq import Seq
from typing import List, Dict

STOP_CODONS = {"TAA", "TAG", "TGA"}

def find_valid_orfs(sequence: str, min_length: int = 30) -> List[Dict]:
    sequence = sequence.upper().replace("\n", "").replace("\r", "")
    results = []

    def scan_strand(seq: Seq, direction: str):
        for frame in range(3):
            i = frame
            while i < len(seq) - 2:
                codon = str(seq[i:i+3])
                if codon == "ATG":
                    start = i
                    protein = ""
                    j = i
                    while j < len(seq) - 2:
                        current_codon = str(seq[j:j+3])
                        if current_codon in STOP_CODONS:
                            end = j + 3
                            if len(protein) >= min_length:
                                results.append({
                                    "frame": str(frame + 1),
                                    "direction": direction,
                                    "start": start,
                                    "end": end,
                                    "protein": str(seq[start:end].translate(to_stop=True))
                                })
                            break
                        protein += str(seq[j:j+3].translate())
                        j += 3
                    i = j  # jump past stop codon or next region
                else:
                    i += 3

    # Scan forward strand
    scan_strand(Seq(sequence), "forward")

    # Scan reverse complement
    scan_strand(Seq(sequence).reverse_complement(), "reverse")

    return results
