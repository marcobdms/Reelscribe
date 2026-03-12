/*
  RESULT BOX — Tarjeta glass para la transcripción.
  
  Estilos en globals.css:
    .result-container  → wrapper con animación fadeSlideUp
    .result-card       → tarjeta glass
    .result-header     → cabecera con título + botón copiar
    .result-title      → texto "TRANSCRIPTION"
    .copy-btn          → botón de copiar al portapapeles
    .result-text       → texto de la transcripción
    .result-text.error → estilo rojo para errores
  
  Para cambiar colores, ve a globals.css → sección 7. RESULT BOX
*/

"use client"

import { useState } from "react"

interface Props {
  transcription: string
}

export default function ResultBox({ transcription }: Props) {

  const [copied, setCopied] = useState(false)

  if (!transcription) return null

  const isError = transcription === "Error transcribing video"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* Fallback silencioso si el clipboard API no está disponible */
    }
  }

  return (

    <div className="result-container">
      <div className="result-card">

        <div className="result-header">
          <span className="result-title">Transcription</span>
          {!isError && (
            <button
              id="copy-btn"
              className="copy-btn"
              onClick={handleCopy}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          )}
        </div>

        {/* 
          FORMATO DEL TEXTO: 
          Texto renderizado directamente sin crear párrafos extra, 
          solo justificado.
        */}
        <div className={`result-text ${isError ? "error" : ""}`} style={{ textAlign: "justify" }}>
          {(() => {
            if (isError) return transcription;
            
            // Quitar espacios al principio y al final
            let text = transcription.trim();
            
            if (text.length > 0) {
              // Si el último caracter no es un punto (u otro signo), añadir punto final.
              const lastChar = text.slice(-1);
              if (!['.', '!', '?'].includes(lastChar)) {
                text += '.';
              }
            }
            
            return text;
          })()}
        </div>

      </div>
    </div>

  )
}