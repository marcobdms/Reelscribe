// services/api.ts

// Esta constante detecta si estamos en Vercel o en local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function transcribeVideo(url: string): Promise<string> {
  // Usamos la variable para construir la ruta al endpoint /transcribe
  const response = await fetch(`${API_BASE_URL}/transcribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
    }),
  });

  if (!response.ok) {
    // Si Railway da error, intentamos capturar el porqué
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "API error");
  }

  const data = await response.json();
  return data.transcription;
}