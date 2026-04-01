"use client"

import { useState } from "react"
import { transcribeVideo } from "../services/api"

export default function Home() {

  const [url, setUrl] = useState("")
  const [language, setLanguage] = useState("auto")
  const [transcription, setTranscription] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [progressPhase, setProgressPhase] = useState<"idle" | "downloading" | "transcribing" | "done">("idle")
  const [copiedAction, setCopiedAction] = useState<string | null>(null)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch { }
  }

  const handleTranscribe = async () => {
    if (!url) return

    setLoading(true)
    setProgressPhase("downloading")
    setTranscription("")

    const transcribingTimeout = setTimeout(() => {
      setProgressPhase("transcribing")
    }, 4000)

    try {
      const result = await transcribeVideo(url, language)
      clearTimeout(transcribingTimeout)
      setProgressPhase("done")
      setTranscription(result)
    } catch (error) {
      clearTimeout(transcribingTimeout)
      setProgressPhase("idle")
      setTranscription("Error transcribing video")
    }

    setLoading(false)
  }

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
      
      const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(fullText)}`
      window.open(chatGptUrl, "_blank", "noopener,noreferrer")
      
      setTimeout(() => setCopiedAction(null), 3000)
    } catch { }
  }

  const isError = transcription.includes("Error transcribing")

  return (
    <>
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white font-inter">ReelScribe</div>
          <nav className="hidden md:flex space-x-8 items-center">
            <a className="text-blue-600 dark:text-blue-400 font-semibold font-inter tracking-tight" href="#">My Transcripts</a>
            <a className="text-slate-500 dark:text-slate-400 font-inter tracking-tight hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors rounded-lg px-3 py-1" href="#">Templates</a>
            <a className="text-slate-500 dark:text-slate-400 font-inter tracking-tight hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors rounded-lg px-3 py-1" href="#">Pro Plan</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="material-symbols-outlined text-slate-600 dark:text-slate-300 p-2 hover:bg-slate-100/50 rounded-full transition-all duration-200">history</button>
            <button className="material-symbols-outlined text-slate-600 dark:text-slate-300 p-2 hover:bg-slate-100/50 rounded-full transition-all duration-200">settings</button>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-500">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-start">
          
          {/* Left Side: Input Column */}
          <div className="space-y-8 flex flex-col items-start">
            <div className="max-w-xl">
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
                Video to text, <br/><span className="opacity-80">magically.</span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed mb-8">
                Precision transcription for creators. Paste your link and let ReelScribe handle the rest with surgical accuracy.
              </p>
            </div>
            
            {/* Input Card */}
            <div className="w-full bg-white/20 backdrop-blur-3xl p-8 rounded-[2rem] shadow-2xl border border-white/30 space-y-6">
              <div className="space-y-4">
                <label className="text-white text-xs font-bold tracking-widest uppercase opacity-70 ml-2">ORIGEN DEL VIDEO</label>
                
                {/* Pill Input Group */}
                <div className="bg-white/90 rounded-full p-2 flex items-center shadow-lg border border-white/50 h-14">
                  <div className="relative flex items-center border-r border-slate-200 hover:bg-slate-100/50 rounded-full h-10 transition-all overflow-hidden w-24">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 w-full h-full pl-4 pr-8 appearance-none cursor-pointer outline-none"
                    >
                      <option value="auto">AUTO</option>
                      <option value="es">ES</option>
                      <option value="en">EN</option>
                      <option value="pt">PT</option>
                      <option value="fr">FR</option>
                      <option value="de">DE</option>
                    </select>
                    <span className="material-symbols-outlined text-slate-400 text-lg absolute right-2 pointer-events-none">expand_more</span>
                  </div>
                  
                  <input 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 font-medium px-4 text-sm h-10 outline-none" 
                    placeholder="https://www.tiktok.com/..." 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  
                  <button 
                    onClick={handlePaste}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full px-5 py-2 flex items-center space-x-2 transition-all duration-200 h-10 active:scale-95 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">content_paste</span>
                    <span className="text-sm font-bold">Pegar</span>
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleTranscribe}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-lg py-5 rounded-xl shadow-xl hover:opacity-90 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  progressPhase === "downloading" ? "Descargando..." : "Transcribiendo..."
                ) : (
                  "Transcribir"
                )}
              </button>
              
              <div className="flex justify-center space-x-6 text-white/60">
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span className="text-xs font-bold uppercase tracking-widest">99% Accuracy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Instant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Results Column */}
          <div className="h-full">
            {/* Results Card */}
            <div className={`bg-white/15 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-white/20 h-full flex flex-col min-h-[600px] transition-all duration-500 ${!transcription && !loading ? 'opacity-40' : 'opacity-100'}`}>
              <div className="flex justify-between items-center mb-6">
                <span className="text-white text-xs font-black tracking-widest uppercase opacity-70">TRANSCRIPCIÓN</span>
                {transcription && !isError && (
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-[10px] text-white/60 font-bold uppercase">Procesado por AI</span>
                  </div>
                )}
              </div>
              
              {/* Results Area */}
              <div className="flex-1 bg-white/10 rounded-2xl p-6 mb-8 border border-white/10 overflow-y-auto min-h-[300px] text-justify">
                {transcription ? (
                  <p className={`text-white/90 leading-relaxed font-inter text-sm md:text-base ${isError ? 'text-red-300' : ''}`}>
                    {transcription}
                  </p>
                ) : (
                  <p className="text-white/40 italic flex items-center justify-center h-full text-sm">
                    {loading ? "Trabajando en la magia..." : "El texto aparecerá aquí después de transcribir."}
                  </p>
                )}
              </div>
              
              {/* Action Grid */}
              <div className={`grid grid-cols-2 gap-4 transition-all duration-300 ${!transcription || isError ? 'opacity-30 pointer-events-none' : ''}`}>
                <button 
                  onClick={handleCopy}
                  className="flex items-center justify-center space-x-2 py-4 bg-white/90 hover:bg-white text-slate-900 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">{copiedAction === "copy" ? "check" : "content_copy"}</span>
                  <span className="text-sm font-bold">{copiedAction === "copy" ? "Copiado!" : "Copiar Simple"}</span>
                </button>
                
                <button 
                  onClick={() => openChatGPTWithPrompt("verify", "Verifica la veracidad de la siguiente información, sé crítico y busca fallos lógicos o datos erróneos si es necesario:")}
                  className="flex items-center justify-center space-x-2 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 active:scale-95 border border-white/20"
                >
                  <span className="material-symbols-outlined text-xl">{copiedAction === "verify" ? "check" : "fact_check"}</span>
                  <span className="text-sm font-bold">{copiedAction === "verify" ? "Abriendo..." : "Inspeccionar Veracidad"}</span>
                </button>
                
                <button 
                  onClick={() => openChatGPTWithPrompt("context", "Dame mucho más contexto, detalles históricos o técnicos, y explícame en profundidad la siguiente información:")}
                  className="flex items-center justify-center space-x-2 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 active:scale-95 border border-white/20"
                >
                  <span className="material-symbols-outlined text-xl">{copiedAction === "context" ? "check" : "psychology"}</span>
                  <span className="text-sm font-bold">{copiedAction === "context" ? "Abriendo..." : "Contexto Profundo"}</span>
                </button>
                
                <button 
                   onClick={() => openChatGPTWithPrompt("chatgpt", "Analiza el siguiente texto extraído de un video corto:")}
                  className="flex items-center justify-center space-x-2 py-4 bg-primary-container hover:opacity-90 text-white rounded-xl transition-all duration-200 active:scale-95 shadow-lg"
                >
                  <span className="material-symbols-outlined text-xl">{copiedAction === "chatgpt" ? "check" : "bolt"}</span>
                  <span className="text-sm font-bold">{copiedAction === "chatgpt" ? "Abriendo..." : "Enviar a ChatGPT"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/10 mt-12 bg-black/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center space-y-4">
          <p className="text-xs font-inter text-white/50 tracking-wide text-center">© 2024 ReelScribe AI. Precision transcription for creators.</p>
          <div className="flex space-x-8">
            <a className="text-xs text-white/40 hover:text-white transition-colors hover:underline" href="#">Privacy</a>
            <a className="text-xs text-white/40 hover:text-white transition-colors hover:underline" href="#">Terms</a>
            <a className="text-xs text-white/40 hover:text-white transition-colors hover:underline" href="#">API Docs</a>
            <a className="text-xs text-white/40 hover:text-white transition-colors hover:underline" href="#">Support</a>
          </div>
        </div>
      </footer>

      {/* Decorative Elements */}
      <div className="fixed top-[20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-orange-400/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </>
  )
}