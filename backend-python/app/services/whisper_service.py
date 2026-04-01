from fastapi import FastAPI
import uvicorn
import os
from faster_whisper import WhisperModel
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuramos el modelo para que corra en CPU con int8 (bajo consumo de RAM)
# Podemos cambiar a "medium" o "small" mediante la variable de entorno si "large-v3" es muy pesado
model_size = os.getenv("WHISPER_MODEL", "large-v3")
logger.info(f"Cargando modelo {model_size} en CPU (int8)... esto puede tardar unos segundos.")

# Cargamos el modelo en memoria una sola vez al iniciar
model = WhisperModel(model_size, device="cpu", compute_type="int8")
logger.info("Modelo cargado exitosamente.")

def transcribe_audio(audio_path: str):
    logger.info(f"Iniciando transcripción de: {audio_path}")
    
    # Transcribe el archivo de audio usando beam_size para mejor precisión
    segments, info = model.transcribe(audio_path, beam_size=5)
    
    text = ""
    for segment in segments:
        text += segment.text + " "
        
    logger.info("Transcripción completada.")
    return text.strip()