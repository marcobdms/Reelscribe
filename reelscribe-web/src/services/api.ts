// services/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function transcribeVideo(url: string, language: string = "auto"): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/transcribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
      language: language
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "API error");
  }

  const data = await response.json();
  return data.transcription;
}