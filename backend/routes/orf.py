# backend/routes/orf.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from utils.bio import find_valid_orfs  # ✅ USE YOUR LOGIC HERE

router = APIRouter()

class ORFRequest(BaseModel):
    sequence: str
    min_length: int = 30

class ORFResponse(BaseModel):
    frame: str
    direction: str
    start: int
    end: int
    protein: str

@router.post("/analyze_orf", response_model=List[ORFResponse])
def analyze_orf(data: ORFRequest):
    sequence = data.sequence
    if not all(base in "ATGCNatgcn" for base in sequence):
        raise HTTPException(status_code=400, detail="Invalid DNA sequence.")

    orfs = find_valid_orfs(sequence, data.min_length)
    return orfs
