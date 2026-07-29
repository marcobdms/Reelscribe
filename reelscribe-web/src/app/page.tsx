"use client"

import { useState, type ReactNode } from "react"
import { transcribeVideo } from "../services/api"

type ProgressPhase = "idle" | "downloading" | "transcribing" | "done"
type IconName =
  | "arrow"
  | "bolt"
  | "check"
  | "chevron"
  | "clipboard"
  | "copy"
  | "document"
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
  bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
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
  document: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h4M10 13h5M10 17h5" />
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

export default function Home() {
  const [url, setUrl] = useState("")
  const [language, setLanguage] = useState("auto")
  const [transcription, setTranscription] = useState("")
  const [loading, setLoading] = useState(false)
  const [progressPhase, setProgressPhase] = useState<ProgressPhase>("idle")
  const [copiedAction, setCopiedAction] = useState<string | null>(null)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch {
      // The field remains available for manual paste.
    }
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
    } catch {
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
    } catch {
      // Clipboard permissions are controlled by the browser.
    }
  }

  const openChatGPTWithPrompt = async (action: string, promptText: string) => {
    try {
      const fullText = `${promptText}\n\n"${transcription}"`
      await navigator.clipboard.writeText(fullText)
      setCopiedAction(action)

      const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(fullText)}`
      window.open(chatGptUrl, "_blank", "noopener,noreferrer")

      setTimeout(() => setCopiedAction(null), 3000)
    } catch {
      // Clipboard and new-window permissions are controlled by the browser.
    }
  }

  const isError = transcription.includes("Error transcribing")
  const hasResult = Boolean(transcription) && !isError
  const isTranscribing = progressPhase === "transcribing"
  const progressLabel = isTranscribing
    ? "Pasando audio a texto"
    : "Preparando el vídeo"
  const progressDetail = isTranscribing
    ? "La transcripción aparecerá en cuanto termine."
    : "Estamos aislando el audio."
  const progressValue = isTranscribing ? 76 : 34

  return (
    <div className="app-page">
      <a className="skip-link" href="#workspace">
        Saltar al transcriptor
      </a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#workspace" aria-label="ReelScribe, transcriptor">
            ReelScribe
          </a>
        </div>
      </header>

      <main className="tool-page" id="main-content">
        <section
          className="workspace"
          id="workspace"
          aria-labelledby="tool-title"
          aria-busy={loading}
        >
          <div className="workspace-body">
            <div className="composer-panel">
              <h1 id="tool-title">Transcribir vídeo</h1>

              <form
                className="transcription-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleTranscribe()
                }}
              >
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
                      placeholder="https://..."
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

                <button className="transcribe-button" type="submit" disabled={loading}>
                  <span>
                    {loading
                      ? isTranscribing
                        ? "Transcribiendo"
                        : "Preparando el vídeo"
                      : "Transcribir"}
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
                  <div className="phase-copy">
                    <strong>{progressLabel}</strong>
                    <p>{progressDetail}</p>
                  </div>
                  <progress
                    aria-label="Progreso de la transcripción"
                    max="100"
                    value={progressValue}
                  >
                    {progressValue}%
                  </progress>
                </div>
              )}
            </div>

            <div className="document-panel">
              <div className="document-toolbar">
                <h2>Transcripción</h2>
              </div>

              <div
                className={`document-sheet ${
                  isError ? "is-error" : hasResult ? "has-content" : ""
                }`}
                aria-label={
                  hasResult
                    ? "Resultado de la transcripción"
                    : "Área de transcripción vacía"
                }
              >
                {isError ? (
                  <div className="error-state" role="alert">
                    <span className="error-icon">
                      <Icon name="document" size={25} />
                    </span>
                    <h3>No pudimos crear la transcripción</h3>
                    <p>Comprueba el enlace e inténtalo de nuevo.</p>
                  </div>
                ) : hasResult ? (
                  <article className="transcript-content">
                    <p dir="auto">{transcription}</p>
                  </article>
                ) : loading ? (
                  <div className="loading-document" role="status">
                    <div className="loading-document-heading">
                      <span className="loading-orbit" aria-hidden="true" />
                      <p>{progressLabel}</p>
                    </div>
                    <div className="skeleton-lines" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                ) : null}
              </div>

              {hasResult && (
                <div
                  className="action-strip"
                  aria-label="Acciones de la transcripción"
                >
                  <button type="button" onClick={handleCopy}>
                    <span className="action-icon">
                      <Icon name={copiedAction === "copy" ? "check" : "copy"} />
                    </span>
                    <span>
                      <strong>
                        {copiedAction === "copy" ? "Copiado" : "Copiar texto"}
                      </strong>
                      <small>Sin formato</small>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openChatGPTWithPrompt(
                        "verify",
                        "Verifica la veracidad de la siguiente información, sé crítico y busca fallos lógicos o datos erróneos si es necesario:",
                      )
                    }
                  >
                    <span className="action-icon">
                      <Icon
                        name={copiedAction === "verify" ? "check" : "factCheck"}
                      />
                    </span>
                    <span>
                      <strong>
                        {copiedAction === "verify" ? "Abriendo" : "Verificar"}
                      </strong>
                      <small>Contrasta los datos</small>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openChatGPTWithPrompt(
                        "context",
                        "Dame mucho más contexto, detalles históricos o técnicos, y explícame en profundidad la siguiente información:",
                      )
                    }
                  >
                    <span className="action-icon">
                      <Icon
                        name={copiedAction === "context" ? "check" : "spark"}
                      />
                    </span>
                    <span>
                      <strong>
                        {copiedAction === "context" ? "Abriendo" : "Dar contexto"}
                      </strong>
                      <small>Amplía la idea</small>
                    </span>
                  </button>

                  <button
                    className="chatgpt-action"
                    type="button"
                    onClick={() =>
                      openChatGPTWithPrompt(
                        "chatgpt",
                        "Analiza el siguiente texto extraído de un video corto:",
                      )
                    }
                  >
                    <span className="action-icon">
                      <Icon
                        name={copiedAction === "chatgpt" ? "check" : "bolt"}
                      />
                    </span>
                    <span>
                      <strong>
                        {copiedAction === "chatgpt" ? "Abriendo" : "Enviar"}
                      </strong>
                      <small>A ChatGPT</small>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <a className="brand" href="#workspace" aria-label="ReelScribe, transcriptor">
            ReelScribe
          </a>
          <p>© 2026 ReelScribe</p>
        </div>
      </footer>
    </div>
  )
}
