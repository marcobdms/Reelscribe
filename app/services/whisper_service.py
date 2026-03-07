from openai import OpenAI

client = OpenAI(
    base_url="https://api.groq.com/openai/v",
    api_key="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")

def transcribe_audio(audio_path: str):

    with open(audio_path, "rb") as audio_file:

        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )

    return transcription.text