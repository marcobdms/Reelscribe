"use client"

interface Props {
  onClick: () => void;
  loading: boolean;
  progressPhase: "idle" | "downloading" | "transcribing" | "done";
}

export default function TranscribeButton({ onClick, loading, progressPhase }: Props) {
  const getButtonContent = () => {
    if (!loading) return "Transcribir";
    
    switch (progressPhase) {
      case "downloading":
        return "Descargando audio...";
      case "transcribing":
        return "Transcribiendo...";
      case "done":
        return "¡Listo!";
      default:
        return "Transcribiendo...";
    }
  };

  const percent = progressPhase === "idle" ? 0 
                : progressPhase === "downloading" ? 30 
                : progressPhase === "transcribing" ? 75 
                : 100;

  return (
    <div className="btn-container">
      <button
        id="transcribe-btn"
        className={`transcribe-btn ${loading ? "is-loading" : ""}`}
        onClick={onClick}
        disabled={loading}
      >
        <span className="btn-text">{getButtonContent()}</span>
        
        {loading && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percent}%` }}></div>
          </div>
        )}
      </button>
    </div>
  );
}