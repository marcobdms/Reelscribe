"use client"

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import { transcribeVideo } from "../services/api"

type Screen = "hero" | "leaving" | "tool"
type ProgressPhase = "idle" | "downloading" | "transcribing" | "done"
type IconName =
  | "arrow"
  | "check"
  | "chevron"
  | "clipboard"
  | "copy"
  | "factCheck"
  | "link"
  | "spark"

const iconPaths: Record<IconName, ReactNode> = {
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4.5V3h6v1.5" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  factCheck: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="m7 10 2 2 4-4M7 16h3M14 16h3" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.14-1.14" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 1.15 3.1A7.4 7.4 0 0 0 17.9 10L21 11l-3.1 1a7.4 7.4 0 0 0-4.75 3.9L12 19l-1.15-3.1A7.4 7.4 0 0 0 6.1 12L3 11l3.1-1a7.4 7.4 0 0 0 4.75-3.9L12 3Z" />
    </>
  ),
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {iconPaths[name]}
    </svg>
  )
}

function PreviewDocument() {
  return (
    <article className="preview-document" aria-label="Ejemplo de transcripción">
      <header className="document-heading">
        <p>Vídeos de creadores.pdf</p>
      </header>
      <div className="preview-document-copy">
        <p className="speaker-label">ALTAVOZ 1 · 0:00</p>
        <p>
          Una idea pequeña puede convertirse en una gran pieza de contenido.
          Empieza por escuchar con atención, encuentra el momento que importa y
          deja que las palabras hagan el resto.
        </p>
        <p>
          Cuando la conversación está por escrito, es mucho más fácil volver a
          ella, compartirla y crear algo nuevo.
        </p>
      </div>
    </article>
  )
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("hero")
  const [url, setUrl] = useState("")
  const [language, setLanguage] = useState("auto")
  const [transcription, setTranscription] = useState("")
  const [loading, setLoading] = useState(false)
  const [progressPhase, setProgressPhase] =
    useState<ProgressPhase>("idle")
  const [copiedAction, setCopiedAction] = useState<string | null>(null)
  const toolTitleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (screen !== "leaving") return

    const transitionTimer = window.setTimeout(() => {
      setScreen("tool")
    }, 280)

    return () => window.clearTimeout(transitionTimer)
  }, [screen])

  useEffect(() => {
    if (screen === "tool") {
      toolTitleRef.current?.focus()
    }
  }, [screen])

  const openTool = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    setScreen(reduceMotion ? "tool" : "leaving")
  }

  const returnHome = () => {
    setScreen("hero")
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch {
      // El campo sigue disponible para pegar manualmente.
    }
  }

  const handleTranscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!url || loading) return

    setLoading(true)
    setProgressPhase("downloading")
    setTranscription("")

    const transcribingTimeout = window.setTimeout(() => {
      setProgressPhase("transcribing")
    }, 4000)

    try {
      const result = await transcribeVideo(url, language)
      window.clearTimeout(transcribingTimeout)
      setProgressPhase("done")
      setTranscription(result)
    } catch {
      window.clearTimeout(transcribingTimeout)
      setProgressPhase("idle")
      setTranscription("Error transcribing video")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription)
      setCopiedAction("copy")
      window.setTimeout(() => setCopiedAction(null), 2000)
    } catch {
      // Los permisos del portapapeles dependen del navegador.
    }
  }

  const openChatGPTWithPrompt = async (
    action: string,
    promptText: string,
  ) => {
    try {
      const fullText = `${promptText}\n\n"${transcription}"`
      await navigator.clipboard.writeText(fullText)
      setCopiedAction(action)
      window.open(
        `https://chatgpt.com/?q=${encodeURIComponent(fullText)}`,
        "_blank",
        "noopener,noreferrer",
      )
      window.setTimeout(() => setCopiedAction(null), 3000)
    } catch {
      // Los permisos del portapapeles dependen del navegador.
    }
  }

  const isError = transcription.includes("Error transcribing")
  const hasResult = Boolean(transcription) && !isError
  const isTranscribing = progressPhase === "transcribing"
  const progressLabel = isTranscribing
    ? "Pasando el audio a texto"
    : "Preparando el vídeo"

  return (
    <div className="app-page">
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>

      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand"
            type="button"
            onClick={returnHome}
            aria-label="Volver a la portada de ReelScribe"
          >
            ReelScribe
          </button>
        </div>
      </header>

      <main id="main-content">
        {screen !== "tool" ? (
          <section
            className={`experience-shell hero-scene ${
              screen === "leaving" ? "is-leaving" : ""
            }`}
            aria-labelledby="hero-title"
          >
            <div className="hero-copy">
              <div>
                <p className="eyebrow">REELSCRIBE</p>
                <h1 id="hero-title">
                  Generador de transcripciones de TikTok con IA
                </h1>
                <p className="hero-description">
                  Pega un enlace de TikTok y ReelScribe convierte vídeos
                  virales, clips de creadores y contenido de marca en texto
                  listo para reutilizar.
                </p>
                <button className="primary-pill" type="button" onClick={openTool}>
                  <span>Convierte audio en texto</span>
                  <Icon name="arrow" size={18} />
                </button>
              </div>
            </div>

            <div className="visual-panel">
              <PreviewDocument />
            </div>
          </section>
        ) : (
          <section
            className="experience-shell tool-scene"
            aria-labelledby="tool-title"
            aria-busy={loading}
          >
            <div className="tool-form-column">
              <div className="tool-form-card">
                <div className="tool-card-heading">
                  <p className="eyebrow">NUEVA TRANSCRIPCIÓN</p>
                  <h1 id="tool-title" ref={toolTitleRef} tabIndex={-1}>
                    Pasa un vídeo a texto
                  </h1>
                </div>

                <form className="transcription-form" onSubmit={handleTranscribe}>
                  <div className="field-group">
                    <label htmlFor="video-url">Enlace del vídeo</label>
                    <div className="url-control">
                      <span className="field-icon">
                        <Icon name="link" size={18} />
                      </span>
                      <input
                        id="video-url"
                        name="video-url"
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        placeholder="https://tiktok.com/..."
                        required
                        value={url}
                        onChange={(event) => setUrl(event.target.value)}
                      />
                      <button
                        className="paste-button"
                        type="button"
                        onClick={handlePaste}
                      >
                        <Icon name="clipboard" size={17} />
                        <span>Pegar</span>
                      </button>
                    </div>
                  </div>

                  <div className="field-group">
                    <label htmlFor="language">Idioma del vídeo</label>
                    <div className="select-control">
                      <select
                        id="language"
                        name="language"
                        value={language}
                        onChange={(event) => setLanguage(event.target.value)}
                      >
                        <option value="auto">Detectar automáticamente</option>
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                      <Icon name="chevron" size={18} />
                    </div>
                  </div>

                  <button
                    className="transcribe-button"
                    type="submit"
                    aria-disabled={loading}
                  >
                    <span>
                      {loading
                        ? isTranscribing
                          ? "Transcribiendo"
                          : "Preparando el vídeo"
                        : "Transcribir vídeo"}
                    </span>
                    {loading ? (
                      <span className="loading-orbit" aria-hidden="true" />
                    ) : (
                      <Icon name="arrow" />
                    )}
                  </button>
                </form>

                {loading && (
                  <div className="phase-card" role="status" aria-live="polite">
                    <div>
                      <strong>{progressLabel}</strong>
                      <p>La transcripción aparecerá en el documento.</p>
                    </div>
                    <span className="phase-pulse" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>

            <div className="visual-panel tool-visual-panel">
              <article className="live-document">
                <header className="document-heading">
                  <p>Transcripción</p>
                </header>

                <div
                  className={`document-body ${
                    hasResult ? "has-content" : ""
                  } ${isError ? "is-error" : ""}`}
                  aria-live="polite"
                >
                  {isError ? (
                    <div className="error-state" role="alert">
                      <strong>No pudimos crear la transcripción.</strong>
                      <p>Comprueba el enlace e inténtalo de nuevo.</p>
                    </div>
                  ) : hasResult ? (
                    <p className="transcript-copy" dir="auto">
                      {transcription}
                    </p>
                  ) : loading ? (
                    <div className="skeleton-lines" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : null}
                </div>

                {hasResult && (
                  <footer
                    className="document-actions"
                    aria-label="Acciones de la transcripción"
                  >
                    <button type="button" onClick={handleCopy}>
                      <Icon
                        name={copiedAction === "copy" ? "check" : "copy"}
                        size={18}
                      />
                      <span>
                        {copiedAction === "copy" ? "Copiado" : "Copiar"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openChatGPTWithPrompt(
                          "verify",
                          "Verifica la veracidad de la siguiente información, sé crítico y señala datos erróneos o fallos lógicos:",
                        )
                      }
                    >
                      <Icon
                        name={
                          copiedAction === "verify" ? "check" : "factCheck"
                        }
                        size={18}
                      />
                      <span>
                        {copiedAction === "verify"
                          ? "Abriendo"
                          : "Verificar"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openChatGPTWithPrompt(
                          "context",
                          "Amplía con contexto histórico o técnico la siguiente transcripción:",
                        )
                      }
                    >
                      <Icon
                        name={copiedAction === "context" ? "check" : "spark"}
                        size={18}
                      />
                      <span>
                        {copiedAction === "context"
                          ? "Abriendo"
                          : "Dar contexto"}
                      </span>
                    </button>
                    <button
                      className="chatgpt-action"
                      type="button"
                      onClick={() =>
                        openChatGPTWithPrompt(
                          "chatgpt",
                          "Analiza el siguiente texto extraído de un vídeo:",
                        )
                      }
                    >
                      <span>
                        {copiedAction === "chatgpt"
                          ? "Abriendo"
                          : "Enviar a ChatGPT"}
                      </span>
                      <Icon name="arrow" size={17} />
                    </button>
                  </footer>
                )}
              </article>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p>© 2026 ReelScribe</p>
        </div>
      </footer>
    </div>
  )
}
