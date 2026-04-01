"use client"

import { useState } from "react"

interface Props {
  transcription: string
}

export default function ResultBox({ transcription }: Props) {

  const [copiedAction, setCopiedAction] = useState<string | null>(null)

  if (!transcription) return null

  const isError = transcription.includes("Error transcribing")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription)
      setCopiedAction("copy")
      setTimeout(() => setCopiedAction(null), 2000)
    } catch { }
  }

  const openChatGPTWithPrompt = async (action: string, promptText: string) => {
    try {
      const fullText = `${promptText}\n\n"${transcription}"`
      
      // Intentamos copiar al portapapeles por si la URL es muy larga y se corta
      await navigator.clipboard.writeText(fullText)
      setCopiedAction(action)
      
      // Abre en nueva pestaña a ChatGPT con el texto pre-rellenado (si la longitud lo permite)
      const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(fullText)}`
      window.open(chatGptUrl, "_blank", "noopener,noreferrer")
      
      setTimeout(() => setCopiedAction(null), 3000)
    } catch { }
  }

  return (
    <div className="result-container">
      <div className="result-card">

        <div className="result-header">
          <span className="result-title">Transcripción</span>
        </div>

        {/* CONTENIDO */}
        <div className={`result-text ${isError ? "error" : ""}`} style={{ textAlign: "justify", marginBottom: "20px" }}>
          {(() => {
            if (isError) return transcription;
            let text = transcription.trim();
            if (text.length > 0) {
              const lastChar = text.slice(-1);
              if (!['.', '!', '?'].includes(lastChar)) {
                text += '.';
              }
            }
            return text;
          })()}
        </div>

        {/* ACCIONES INTELIGENTES */}
        {!isError && (
          <div className="action-buttons">
            <button className="ai-btn" onClick={handleCopy}>
              {copiedAction === "copy" ? "Copiado ✓" : "Copiar Simple"}
            </button>
            <button 
              className="ai-btn" 
              onClick={() => openChatGPTWithPrompt("verify", "Verifica la veracidad de la siguiente información, sé crítico y busca fallos lógicos o datos erróneos si es necesario:")}
            >
              {copiedAction === "verify" ? "Abriendo GPT..." : "Inspeccionar Veracidad"}
            </button>
            <button 
              className="ai-btn" 
              onClick={() => openChatGPTWithPrompt("context", "Dame mucho más contexto, detalles históricos o técnicos, y explícame en profundidad la siguiente información:")}
            >
              {copiedAction === "context" ? "Abriendo GPT..." : "Contexto Profundo"}
            </button>
            <button 
              className="ai-btn" 
              onClick={() => openChatGPTWithPrompt("chatgpt", "Analiza el siguiente texto extraído de un video corto:")}
            >
              {copiedAction === "chatgpt" ? "Abriendo GPT..." : "Enviar a ChatGPT"}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}