"use client"

import { useState } from "react"
import UrlInput from "../components/UrlInput"
import TranscribeButton from "../components/TranscribeButton"
import ResultBox from "../components/ResultBox"
import { transcribeVideo } from "../services/api"

/*
  PAGE — Página principal de ReelScribe.
  
  El layout usa las clases CSS de globals.css:
    - .app-container → centra todo en la pantalla
    - .glass-card   → la tarjeta con efecto cristal
    - .app-title    → título con gradiente de color
    - .app-subtitle → subtítulo en gris
  
  Para ajustar colores o tamaños, ve a globals.css → sección :root
  No necesitas tocar este archivo para cambiar estilos.
*/
export default function Home() {

  const [url, setUrl] = useState("")
  const [transcription, setTranscription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTranscribe = async () => {

    if (!url) return

    setLoading(true)
    setTranscription("")

    try {

      const result = await transcribeVideo(url)
      setTranscription(result)

    } catch (error) {

      setTranscription("Error transcribing video")

    }

    setLoading(false)
  }

  return (

    <main className="app-container">

      <div className="glass-card">

        <h1 className="app-title">ReelScribe</h1>

        <p className="app-subtitle">
          Paste a TikTok, Reel or Shorts URL
        </p>

        <UrlInput url={url} setUrl={setUrl} />

        <TranscribeButton
          onClick={handleTranscribe}
          loading={loading}
        />

      </div>

      <ResultBox transcription={transcription} />

    </main>
  )
}