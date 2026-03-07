import yt_dlp
import tempfile
import os

def download_audio(url: str) -> str:
    tmpdir = tempfile.mkdtemp()
    
    output_path = os.path.join(tmpdir, "audio.%(ext)s")

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": output_path,
        "cookiefile": "youtube_cookies.txt",  # <--- ESTA ES LA LÍNEA CLAVE
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
        "quiet": True,
        # Añadimos un User-Agent para mayor seguridad
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    audio_file = os.path.join(tmpdir, "audio.mp3")

    return audio_file