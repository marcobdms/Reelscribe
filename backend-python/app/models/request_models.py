from pydantic import BaseModel
from typing import Optional

class TranscriptionRequest(BaseModel):
    url: str
    language: Optional[str] = "auto"