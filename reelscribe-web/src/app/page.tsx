"use client"

import { useState } from "react"
import { transcribeVideo } from "../services/api"

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

    <main style={{padding:40,fontFamily:"Arial"}}>

      <h1>ReelScribe</h1>

      <p>Paste TikTok / Reels / Shorts URL</p>

      <input
        type="text"
        placeholder="https://..."
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
        style={{
          width:"100%",
          padding:10,
          marginBottom:20
        }}
      />

      <button
        onClick={handleTranscribe}
        style={{
          padding:"10px 20px",
          cursor:"pointer"
        }}
      >
        {loading ? "Transcribing..." : "Transcribe"}
      </button>

      <div style={{marginTop:40}}>

        <h3>Result</h3>

        <p>{transcription}</p>

      </div>

    </main>
  )
}