"use client"

import { useState, useEffect } from "react"
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

  const fullTitle = "ReelScribe"
  const [displayedTitle, setDisplayedTitle] = useState("")
  const [url, setUrl] = useState("")
  const [transcription, setTranscription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setDisplayedTitle(fullTitle.slice(0, index + 1))
      index++
      if (index >= fullTitle.length) {
        clearInterval(interval)
      }
    }, 120) // Typing speed: 120ms per character
    return () => clearInterval(interval)
  }, [])

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

        <h1 className="app-title">
          {displayedTitle}<span className="cursor-blink">|</span>
        </h1>

        <p className="app-subtitle">
          Video Transcriber
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