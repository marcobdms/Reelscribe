/*
  TRANSCRIBE BUTTON — Botón pill con gradiente.
  
  Estilos controlados por la clase .transcribe-btn en globals.css.
  Para cambiar colores del gradiente del botón, ajusta
  --accent-primary y --accent-secondary en globals.css → :root
  
  El loading spinner gira vía la animación @keyframes spin en globals.css.
*/

interface Props {
  onClick: () => void
  loading: boolean
}

export default function TranscribeButton({ onClick, loading }: Props) {

  return (

    <button
      id="transcribe-btn"
      className="transcribe-btn"
      onClick={onClick}
      disabled={loading}
    >
      {loading && <span className="loading-spinner" />}
      {loading ? "Transcribing..." : "Transcribe"}
    </button>

  )
}