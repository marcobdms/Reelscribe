import "./globals.css"

export const metadata = {
  title: "ReelScribe",
  description: "Transcribe TikTok, Reels and Shorts"
}

/*
  LAYOUT — Aquí solo se carga la fuente Inter de Google Fonts.
  No hay nada más que tocar aquí para ajustar estilos;
  todo el diseño visual está en globals.css.
*/
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Fuente Inter de Google Fonts — Puedes cambiarla por otra si quieres */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}