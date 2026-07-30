"use client"

import { useEffect, useState } from "react"

const THEME_STORAGE_KEY = "reelscribe-theme"

function applyTheme(isDark: boolean) {
  const root = document.documentElement
  root.classList.toggle("dark", isDark)
  root.classList.toggle("light", !isDark)
  root.style.colorScheme = isDark ? "dark" : "light"
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const syncFromDocument = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    const syncFromSystem = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(event.matches)
        setIsDark(event.matches)
      }
    }
    const syncAcrossTabs = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return

      const nextIsDark = event.newValue
        ? event.newValue === "dark"
        : media.matches

      applyTheme(nextIsDark)
      setIsDark(nextIsDark)
    }

    syncFromDocument()
    media.addEventListener("change", syncFromSystem)
    window.addEventListener("storage", syncAcrossTabs)

    return () => {
      media.removeEventListener("change", syncFromSystem)
      window.removeEventListener("storage", syncAcrossTabs)
    }
  }, [])

  const handleToggle = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark")
    applyTheme(nextIsDark)
    localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? "dark" : "light")
    setIsDark(nextIsDark)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Modo oscuro: ${isDark ? "desactivar" : "activar"}`}
      className="theme-toggle"
      onClick={handleToggle}
      suppressHydrationWarning
    >
      <span className="theme-toggle__label">Modo oscuro</span>
      <span className="theme-toggle__track" aria-hidden="true" />
    </button>
  )
}
