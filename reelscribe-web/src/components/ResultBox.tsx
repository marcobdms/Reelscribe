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
          Aquí procesamos la transcripción. 
          Si es un error, lo mostramos normal.
          Si es texto válido, lo dividimos por saltos de línea (\n\n o \n) 
          y generamos un párrafo <p> por cada bloque.
        */}
        <div className={`result-text ${isError ? "error" : ""}`}>
          {isError ? (
            <p>{transcription}</p>
          ) : (
            transcription.split(/\n+/).map((paragraph, index) => {
              // Solo renderizamos párrafos que tengan contenido
              if (!paragraph.trim()) return null;
              return (
                <p key={index} style={{ marginBottom: "12px", textAlign: "justify" }}>
                  {paragraph}
                </p>
              );
            })
          )}
        </div>

      </div>
    </div>

  )
}