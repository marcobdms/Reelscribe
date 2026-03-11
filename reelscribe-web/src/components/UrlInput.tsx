/*
  URL INPUT — Input estilo Apple con botón de pegar integrado.
  
  Estilos controlados por las clases .url-input-wrapper,
  .url-input, y .paste-btn en globals.css.
  
  El botón de Paste usa navigator.clipboard.readText() para
  pegar lo que el usuario tenga copiado.
*/

"use client"

interface Props {
  url: string
  setUrl: (value: string) => void
}

export default function UrlInput({ url, setUrl }: Props) {

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch {
      /* Clipboard API no disponible o permiso denegado */
    }
  }

  return (

    <div className="url-input-wrapper">
      <input
        id="url-input"
        type="text"
        className="url-input"
        placeholder="Paste TikTok / Reel / Shorts URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        id="paste-btn"
        type="button"
        className="paste-btn"
        onClick={handlePaste}
        title="Paste from clipboard"
      >
        {/* Icono clipboard SVG */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="2" width="6" height="4" rx="1" />
          <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
        </svg>
        <span>Paste</span>
      </button>
    </div>

  )
}