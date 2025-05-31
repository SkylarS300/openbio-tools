from fastapi import FastAPI
from routes import orf
from routes import rnaseq
from fastapi.middleware.cors import CORSMiddleware
from routes import interactions

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, this allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(rnaseq.router)
app.include_router(interactions.router)

# Add routes from orf.py
app.include_router(orf.router)
