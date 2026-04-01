"use client"

interface Props {
  onClick: () => void;
  loading: boolean;
  progressPhase: "idle" | "downloading" | "transcribing" | "done";
}

export default function TranscribeButton({ onClick, loading, progressPhase }: Props) {
  const getButtonContent = () => {
    if (!loading) return "Transcribe";
    
    switch (progressPhase) {
      case "downloading":
        return "⬇️ Downloading audio...";
      case "transcribing":
        return "🎙️ Transcribing...";
      case "done":
        return "✅ Ready!";
      default:
        return "Transcribing...";
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