from fastapi import FastAPI
from routes import orf
from routes import rnaseq
from fastapi.middleware.cors import CORSMiddleware
from routes import interactions
from routes import crispr

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only — allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orf.router)
app.include_router(rnaseq.router)
app.include_router(interactions.router)
app.include_router(crispr.router)
