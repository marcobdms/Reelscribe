"use client"

import { useState, useEffect } from "react"
import UrlInput from "../components/UrlInput"
import TranscribeButton from "../components/TranscribeButton"
import ResultBox from "../components/ResultBox"
import { transcribeVideo } from "../services/api"

export default function Home() {

  const fullTitle = "ReelScribe"
  const [displayedTitle, setDisplayedTitle] = useState("")

  const [url, setUrl] = useState("")
  const [language, setLanguage] = useState("auto")
  const [transcription, setTranscription] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [progressPhase, setProgressPhase] = useState<"idle" | "downloading" | "transcribing" | "done">("idle")

  // History state
  const [history, setHistory] = useState<{url: string, transcription: string, date: string}[]>([])

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("reelscribe_history")
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  // Title effect
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setDisplayedTitle(fullTitle.slice(0, index + 1))
      index++
      if (index >= fullTitle.length) {
        clearInterval(interval)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [])

  const saveToHistory = (newUrl: string, result: string) => {
    const newEntry = { url: newUrl, transcription: result, date: new Date().toLocaleString() }
    const updatedHistory = [newEntry, ...history.filter(h => h.url !== newUrl)].slice(0, 15) // Keep last 15
    setHistory(updatedHistory)
    localStorage.setItem("reelscribe_history", JSON.stringify(updatedHistory))
  }

  const handleTranscribe = async () => {
    if (!url) return

    setLoading(true)
    setProgressPhase("downloading")
    setTranscription("")

    // Fake phase transition based on time: video download takes roughly 4s.
    const transcribingTimeout = setTimeout(() => {
      setProgressPhase("transcribing")
    }, 4000)

    try {
      const result = await transcribeVideo(url, language)
      clearTimeout(transcribingTimeout)
      setProgressPhase("done")
      setTranscription(result)
      saveToHistory(url, result)
    } catch (error) {
      clearTimeout(transcribingTimeout)
      setProgressPhase("idle")
      setTranscription("Error transcribing video")
    }

    setLoading(false)
  }

  const loadFromHistory = (histUrl: string, histTrans: string) => {
    setUrl(histUrl)
    setTranscription(histTrans)
    setProgressPhase("done")
  }

  return (
    <main className="app-container">

      <div className={`main-content-row ${transcription ? "has-result" : ""}`}>
        <div className="glass-card">

          <h1 className="app-title">
            {displayedTitle}<span className="cursor-blink">|</span>
          </h1>

          <p className="app-subtitle">
            Video Transcriber
          </p>

          <UrlInput 
            url={url} 
            setUrl={setUrl} 
            language={language} 
            setLanguage={setLanguage} 
          />

          <TranscribeButton
            onClick={handleTranscribe}
            loading={loading}
            progressPhase={progressPhase}
          />

          {/* HISTORY DROPDOWN */}
          {history.length > 0 && (
            <div className="history-section">
              <p className="history-title">Recent Transcriptions</p>
              <ul className="history-list">
                {history.map((h, i) => (
                  <li key={i} onClick={() => loadFromHistory(h.url, h.transcription)}>
                    {h.url.length > 35 ? h.url.substring(0, 35) + "..." : h.url}
                    <span className="history-date">{h.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        <ResultBox transcription={transcription} />
      </div>

    </main>
  )
}