import yt_dlp
import tempfile
import os


def download_audio(url: str) -> str:
    tmpdir = tempfile.mkdtemp()
    
    output_path = os.path.join(tmpdir, "audio.%(ext)s")

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": output_path,
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
        }],
        "quiet": True
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    audio_file = os.path.join(tmpdir, "audio.mp3")

    return audio_file