import "./globals.css"

export const metadata = {
  title: "ReelScribe",
  description: "Transcribe TikTok, Reels and Shorts"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}