"use client"

interface Props {
  url: string;
  setUrl: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
}

const LANGUAGES = [
  { code: "auto", name: "Auto-detect" },
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
];

export default function UrlInput({ url, setUrl, language, setLanguage }: Props) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      /* Fallback silencioso */
    }
  };

  return (
    <div className="url-input-container">
      <div className="url-input-row">
        <select 
          className="lang-select" 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          title="Select Language"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.code.toUpperCase()}</option>
          ))}
        </select>
        
        <div className="url-input-wrapper">
          <input
            id="url-input"
            type="text"
            className="url-input"
            placeholder="Paste Your URL Video Here"
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
      </div>
    </div>
  );
}