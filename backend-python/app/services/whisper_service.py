from fastapi import FastAPI
import uvicorn
import os
from faster_whisper import WhisperModel
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cambiamos el modelo por defecto a 'small' para VPS con CPU limitada.
# 'small' es unas 10 veces más rápido que 'large-v3' en CPU.
model_size = os.getenv("WHISPER_MODEL", "small")
logger.info(f"Cargando modelo {model_size} en CPU (int8)... esto puede tardar unos segundos.")

# Cargamos el modelo
model = WhisperModel(model_size, device="cpu", compute_type="int8")
logger.info("Modelo cargado exitosamente.")

def transcribe_audio(audio_path: str, language: str = "auto"):
    logger.info(f"Iniciando transcripción de: {audio_path}")
    
    # Reducimos beam_size a 1 para máxima velocidad (Greedy transcription)
    # y activamos vad_filter para eliminar ruidos de fondo
    lang_param = None if language == "auto" else language
    segments, info = model.transcribe(
        audio_path, 
        language=lang_param,
        beam_size=1, 
        vad_filter=True, 
        vad_parameters=dict(min_silence_duration_ms=500)
    )
    
    text = ""
    for segment in segments:
        text += segment.text + " "
        
    logger.info(f"Transcripción completada. Idioma detectado/usado: {info.language}")
    return text.strip()