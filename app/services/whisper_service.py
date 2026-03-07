from openai import OpenAI

client = OpenAI(api_key='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')

def transcribe_audio(audio_path: str):

    with open(audio_path, "rb") as audio_file:

        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )

    return transcription.text