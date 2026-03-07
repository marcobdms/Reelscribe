from pydantic import BaseModel

class TranscriptionRequest(BaseModel):
    url: str