from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class CRISPRRequest(BaseModel):
    sequence: str
    min_gc: float = 40.0
    max_gc: float = 60.0
    min_score: int = 0

class Guide(BaseModel):
    guide: str
    start: int
    strand: str
    pam: str
    gc: float
    score: int

def score_guide(guide: str, position: int, seq_len: int) -> int:
    gc_count = guide.count("G") + guide.count("C")
    gc_content = gc_count / len(guide)

    # GC score (ideal range 40–60%)
    if 0.4 <= gc_content <= 0.6:
        gc_score = 40
    else:
        gc_score = int(40 * (1 - abs(gc_content - 0.5) * 2))

    # Penalty for poly-T sequence
    poly_t_penalty = -20 if "TTTT" in guide else 0

    # Position score favors guides earlier in the sequence
    pos_score = int(40 * (1 - position / seq_len))

    return max(0, gc_score + poly_t_penalty + pos_score)

@router.post("/crispr/guides", response_model=List[Guide])
def find_guides(data: CRISPRRequest):
    seq = data.sequence.upper().replace("\n", "").replace(" ", "")
    if not set(seq).issubset({"A", "T", "C", "G"}):
        raise HTTPException(status_code=400, detail="Invalid DNA sequence.")

    guides = []

    # + strand
    for i in range(len(seq) - 23):
        window = seq[i:i+23]
        guide, pam = window[:20], window[20:]
        if pam[1:] == "GG":
            gc = gc_content(guide)
            if data.min_gc <= gc <= data.max_gc:
                score = score_guide(guide, i, len(seq))
                if score >= data.min_score:
                    guides.append(Guide(guide=guide, start=i, strand="+", pam=pam, gc=gc, score=score))

    # - strand (reverse complement)
    rev_seq = reverse_complement(seq)
    for i in range(len(rev_seq) - 23):
        window = rev_seq[i:i+23]
        guide, pam = window[:20], window[20:]
        if pam[1:] == "GG":
            orig_index = len(seq) - (i + 23)
            gc = gc_content(guide)
            if data.min_gc <= gc <= data.max_gc:
                score = score_guide(guide, i, len(seq))
                if score >= data.min_score:
                    guides.append(Guide(guide=guide, start=orig_index, strand="-", pam=pam, gc=gc, score=score))

    guides.sort(key=lambda g: g.score, reverse=True)

    return guides

def reverse_complement(seq: str) -> str:
    complement = {"A": "T", "T": "A", "C": "G", "G": "C"}
    return "".join(complement[base] for base in reversed(seq))

def gc_content(seq: str) -> float:
    gc = seq.count("G") + seq.count("C")
    return round((gc / len(seq)) * 100, 2)
