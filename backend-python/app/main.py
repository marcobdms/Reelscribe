from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.transcribe import router as transcribe_router

app = FastAPI(
    title="ReelScribe API",
    description="Transcribe short-form videos from TikTok, Reels and Shorts",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcribe_router)

@app.get("/")
def root():
    return {"status": "ReelScribe API running"}