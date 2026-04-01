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
      await navigator.clipboard.writeText(fullText)
      setCopiedAction(action)
      
      // Abre en nueva pestaña a ChatGPT
      window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer")
      
      setTimeout(() => setCopiedAction(null), 3000)
    } catch { }
  }

  return (
    <div className="result-container">
      <div className="result-card">

        <div className="result-header">
          <span className="result-title">Transcription</span>
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
            <button className="ai-btn copy-only" onClick={handleCopy}>
              {copiedAction === "copy" ? "Copied ✓" : "Copy Simple"}
            </button>
            <button 
              className="ai-btn verify" 
              onClick={() => openChatGPTWithPrompt("verify", "Verifica la veracidad de la siguiente información, sé crítico y busca fallos lógicos o datos erróneos si es necesario:")}
            >
              {copiedAction === "verify" ? "Opening GPT..." : "🔍 Inspect Truth"}
            </button>
            <button 
              className="ai-btn context" 
              onClick={() => openChatGPTWithPrompt("context", "Dame mucho más contexto, detalles históricos o técnicos, y explícame en profundidad la siguiente información:")}
            >
              {copiedAction === "context" ? "Opening GPT..." : "🧠 Deep Context"}
            </button>
            <button 
              className="ai-btn chatgpt" 
              onClick={() => openChatGPTWithPrompt("chatgpt", "Analiza el siguiente texto extraído de un video corto:")}
            >
              {copiedAction === "chatgpt" ? "Opening GPT..." : "🤖 Send to ChatGPT"}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}