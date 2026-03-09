export async function transcribeVideo(url: string): Promise<string> {

  const response = await fetch(
    "https://reelscribe-production-c7e1.up.railway.app/transcribe",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url
      }),
    }
  )

  const data = await response.json()

  return data.transcription
}