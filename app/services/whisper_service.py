from openai import OpenAI

client = OpenAI(
    # Corregido: añadimos el '1'
    base_url="https://api.groq.com/openai/v1",
    api_key="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"
)

def transcribe_audio(audio_path: str):
    with open(audio_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            # Corregido: usamos el modelo de Groq
            model="whisper-large-v3",
            file=audio_file
        )
    return transcription.text