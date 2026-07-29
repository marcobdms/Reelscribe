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
  | "clock"
  | "copy"
  | "document"
  | "factCheck"
  | "gear"
  | "link"
  | "person"
  | "spark"
  | "text"

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
  clock: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l3 2" />
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
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.12.38.33.72.6 1 .3.27.68.4 1.1.4h.1v4h-.1a1.7 1.7 0 0 0-1.7.6Z" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.14-1.14" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 1.15 3.1A7.4 7.4 0 0 0 17.9 10L21 11l-3.1 1a7.4 7.4 0 0 0-4.75 3.9L12 19l-1.15-3.1A7.4 7.4 0 0 0 6.1 12L3 11l3.1-1a7.4 7.4 0 0 0 4.75-3.9L12 3Z" />
    </>
  ),
  text: (
    <>
      <path d="M4 6h16M8 6v12M16 6v12M6 18h4M14 18h4" />
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

const phaseContent: Record<
  ProgressPhase,
  { label: string; detail: string; progress: number }
> = {
  idle: {
    label: "Listo para empezar",
    detail: "Pega un enlace para crear un documento nuevo.",
    progress: 0,
  },
  downloading: {
    label: "Preparando el vídeo",
    detail: "Estamos aislando el audio y dejándolo listo.",
    progress: 34,
  },
  transcribing: {
    label: "Pasando audio a texto",
    detail: "La transcripción aparecerá aquí en cuanto termine.",
    progress: 76,
  },
  done: {
    label: "Transcripción lista",
    detail: "Ya puedes copiarla o llevarla a ChatGPT.",
    progress: 100,
  },
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
      // The browser will keep the field available for manual paste.
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
  const currentPhase = phaseContent[progressPhase]
  const documentStatus = isError
    ? "No se pudo transcribir"
    : loading
      ? currentPhase.label
      : hasResult
        ? "Documento listo"
        : "Esperando un enlace"

  return (
    <div className="app-page">
      <a className="skip-link" href="#workspace">
        Saltar al transcriptor
      </a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="ReelScribe, inicio">
            <span className="brand-mark">
              <Icon name="text" size={18} />
            </span>
            <span>ReelScribe</span>
          </a>

          <nav className="primary-nav" aria-label="Navegación principal">
            <a href="#workspace" aria-current="page">
              Producto
            </a>
            <a href="#workflow">Cómo funciona</a>
            <a href="#footer">Plan Pro</a>
          </nav>

          <div className="header-actions">
            <span className="pro-badge">Pro</span>
            <button className="icon-button" type="button" aria-label="Abrir historial">
              <Icon name="clock" />
            </button>
            <button className="icon-button" type="button" aria-label="Abrir ajustes">
              <Icon name="gear" />
            </button>
            <button className="profile-button" type="button" aria-label="Abrir perfil">
              <Icon name="person" />
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              Transcripción para creadores
            </p>
            <h1 id="hero-title">
              Del vídeo a la idea,
              <span>sin perder el hilo.</span>
            </h1>
            <p className="hero-description">
              Pega el enlace. ReelScribe se ocupa del ruido y te devuelve un
              texto limpio, preciso y listo para trabajar.
            </p>
            <a className="hero-cta" href="#workspace">
              Empezar a transcribir
              <Icon name="arrow" />
            </a>
          </div>

          <ol className="process-list" aria-label="Proceso de transcripción">
            <li>
              <span>01</span>
              <div>
                <strong>Pega el enlace</strong>
                <p>Deja aquí el vídeo que quieres convertir.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Elige el idioma</strong>
                <p>O deja que ReelScribe lo detecte por ti.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Trabaja con el texto</strong>
                <p>Copia, contrasta o amplía el resultado.</p>
              </div>
            </li>
          </ol>
        </section>

        <section
          className="workspace section-shell"
          id="workspace"
          aria-labelledby="workspace-title"
          aria-busy={loading}
        >
          <div className="workspace-bar">
            <div className="workspace-title">
              <span className="workspace-app-icon">
                <Icon name="document" size={17} />
              </span>
              <div>
                <p>ReelScribe</p>
                <h2 id="workspace-title">Nuevo documento</h2>
              </div>
            </div>

            <div
              className={`document-status ${
                isError ? "is-error" : hasResult ? "is-complete" : ""
              }`}
              role="status"
              aria-live="polite"
            >
              <span />
              {documentStatus}
            </div>
          </div>

          <div className="workspace-body">
            <div className="composer-panel">
              <div className="panel-heading">
                <p className="section-kicker">01 · AÑADE UN VÍDEO</p>
                <h2>¿Qué quieres transcribir?</h2>
                <p>
                  Añade el enlace y decide si quieres detectar el idioma
                  automáticamente.
                </p>
              </div>

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
                      ? progressPhase === "downloading"
                        ? "Preparando el vídeo"
                        : "Transcribiendo"
                      : "Transcribir vídeo"}
                  </span>
                  {loading ? (
                    <span className="loading-orbit" aria-hidden="true" />
                  ) : (
                    <Icon name="arrow" />
                  )}
                </button>
              </form>

              <div
                className={`phase-card ${loading ? "is-active" : ""}`}
                aria-live="polite"
              >
                <div className="phase-icon">
                  <Icon
                    name={progressPhase === "done" ? "check" : "spark"}
                    size={18}
                  />
                </div>
                <div className="phase-copy">
                  <strong>{currentPhase.label}</strong>
                  <p>{currentPhase.detail}</p>
                </div>
                {loading && (
                  <progress
                    aria-label="Progreso de la transcripción"
                    max="100"
                    value={currentPhase.progress}
                  >
                    {currentPhase.progress}%
                  </progress>
                )}
              </div>

              <div className="composer-facts" aria-label="Ventajas de ReelScribe">
                <span>
                  <Icon name="factCheck" size={17} />
                  99% de precisión
                </span>
                <span>
                  <Icon name="bolt" size={17} />
                  Resultado inmediato
                </span>
              </div>
            </div>

            <div className="document-panel">
              <div className="document-toolbar">
                <div>
                  <p className="section-kicker">02 · TU TEXTO</p>
                  <h2>Transcripción</h2>
                </div>
                <span className="document-language">
                  {language === "auto" ? "Idioma automático" : language.toUpperCase()}
                </span>
              </div>

              <div
                className={`document-sheet ${
                  isError ? "is-error" : hasResult ? "has-content" : ""
                }`}
              >
                {isError ? (
                  <div className="error-state" role="alert">
                    <span className="empty-icon">
                      <Icon name="document" size={26} />
                    </span>
                    <h3>No pudimos crear la transcripción</h3>
                    <p>
                      Comprueba el enlace e inténtalo de nuevo. No se ha
                      modificado ningún documento.
                    </p>
                  </div>
                ) : hasResult ? (
                  <article className="transcript-content">
                    <div className="transcript-meta">
                      <span>TRANSCRIPCIÓN COMPLETA</span>
                      <span>LISTA PARA EDITAR</span>
                    </div>
                    <p dir="auto">{transcription}</p>
                  </article>
                ) : loading ? (
                  <div className="loading-document" role="status">
                    <div className="loading-document-heading">
                      <span className="loading-orbit" aria-hidden="true" />
                      <p>{currentPhase.label}</p>
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
                ) : (
                  <div className="empty-state">
                    <span className="empty-icon">
                      <Icon name="document" size={26} />
                    </span>
                    <h3>Aquí empieza el documento</h3>
                    <p>
                      La transcripción aparecerá en este espacio, sin
                      distracciones y lista para usar.
                    </p>
                  </div>
                )}
              </div>

              <div className="action-strip" aria-label="Acciones de la transcripción">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!hasResult}
                >
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
                  disabled={!hasResult}
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
                  disabled={!hasResult}
                  onClick={() =>
                    openChatGPTWithPrompt(
                      "context",
                      "Dame mucho más contexto, detalles históricos o técnicos, y explícame en profundidad la siguiente información:",
                    )
                  }
                >
                  <span className="action-icon">
                    <Icon name={copiedAction === "context" ? "check" : "spark"} />
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
                  disabled={!hasResult}
                  onClick={() =>
                    openChatGPTWithPrompt(
                      "chatgpt",
                      "Analiza el siguiente texto extraído de un video corto:",
                    )
                  }
                >
                  <span className="action-icon">
                    <Icon name={copiedAction === "chatgpt" ? "check" : "bolt"} />
                  </span>
                  <span>
                    <strong>
                      {copiedAction === "chatgpt" ? "Abriendo" : "Enviar"}
                    </strong>
                    <small>A ChatGPT</small>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="workflow-section section-shell"
          id="workflow"
          aria-labelledby="workflow-title"
        >
          <div className="workflow-intro">
            <p className="eyebrow">DESPUÉS DE TRANSCRIBIR</p>
            <h2 id="workflow-title">No termina en un bloque de texto.</h2>
            <p>
              Cada resultado llega preparado para convertirse en una decisión,
              una investigación o la siguiente pieza de contenido.
            </p>
          </div>

          <div className="workflow-grid">
            <article>
              <span className="feature-number">01</span>
              <span className="feature-icon">
                <Icon name="copy" />
              </span>
              <h3>Limpio desde el primer clic.</h3>
              <p>
                Copia el contenido sin marcas ni formato adicional y llévalo a
                cualquier herramienta.
              </p>
            </article>
            <article>
              <span className="feature-number">02</span>
              <span className="feature-icon">
                <Icon name="factCheck" />
              </span>
              <h3>No des nada por hecho.</h3>
              <p>
                Envía el texto a ChatGPT con una instrucción preparada para
                revisar afirmaciones y detectar fallos.
              </p>
            </article>
            <article>
              <span className="feature-number">03</span>
              <span className="feature-icon">
                <Icon name="spark" />
              </span>
              <h3>Ve más allá del vídeo.</h3>
              <p>
                Añade contexto histórico o técnico sin volver a escribir el
                contenido ni perder el punto de partida.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="section-shell footer-inner">
          <a className="brand footer-brand" href="#top" aria-label="ReelScribe, inicio">
            <span className="brand-mark">
              <Icon name="text" size={18} />
            </span>
            <span>ReelScribe</span>
          </a>
          <p>© 2026 ReelScribe. Video a texto, sin perder el hilo.</p>
          <nav aria-label="Enlaces legales">
            <a href="#footer">Privacidad</a>
            <a href="#footer">Términos</a>
            <a href="#footer">API</a>
            <a href="#footer">Soporte</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
