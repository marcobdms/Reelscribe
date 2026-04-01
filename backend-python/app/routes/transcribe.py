from fastapi import APIRouter
from app.models.request_models import TranscriptionRequest
from app.services.ytdlp_service import download_audio
from app.services.whisper_service import transcribe_audio

router = APIRouter()

@router.post("/transcribe")
async def transcribe_video(payload: TranscriptionRequest):

    url = payload.url
    language = payload.language

    audio_path = download_audio(url)

    text = transcribe_audio(audio_path, language)

    return {
        "transcription": text
    }