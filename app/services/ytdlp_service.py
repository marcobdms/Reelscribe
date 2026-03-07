import yt_dlp
import tempfile
import os

def download_audio(url: str) -> str:
    tmpdir = tempfile.mkdtemp()
    
    output_path = os.path.join(tmpdir, "audio.%(ext)s")

    ydl_opts = {
        # 1. Cambiamos el formato para ser más específicos
        "format": "m4a/bestaudio/best",
        "outtmpl": output_path,
        "cookiefile": "youtube_cookies.txt",
        
        # 2. Forzamos el cliente de iOS (esto suele saltarse el n-challenge)
        "extractor_args": {
            "youtube": {
                "player_client": ["ios"],
                "skip": ["dash", "hls"]
            }
        },
        
        # 3. Quitamos la línea de remote_components que dio error de letras
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
        
        "quiet": True,
        "no_warnings": True,
        # 4. Un User-Agent de iPhone real
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    audio_file = os.path.join(tmpdir, "audio.mp3")

    return audio_file