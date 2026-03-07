import shutil
print(f"¿FFmpeg instalado?: {shutil.which('ffmpeg')}")

from fastapi import FastAPI
from app.routes.transcribe import router as transcribe_router

app = FastAPI(
    title="ReelScribe API",
    description="Transcribe short-form videos from TikTok, Reels and Shorts",
    version="1.0"
)

app.include_router(transcribe_router)

@app.get("/")
def root():
    return {"status": "ReelScribe API running"}