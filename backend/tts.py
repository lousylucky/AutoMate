import asyncio
import json
import websockets
import numpy as np
import simpleaudio as sa
import soundfile as sf
import base64

class UnmuteTTSClient:
    def __init__(self, ws_url="ws://127.0.0.1:8000/v1/realtime", voice="default"):
        self.ws_url = ws_url
        self.voice = voice

    async def generate_audio(self, text):
        async with websockets.connect(
            self.ws_url,
            subprotocols=["realtime"],  # requis
        ) as ws:
            # ---  Démarrer la session ---
            await ws.send(json.dumps({
                "type": "session.update",
                "session": {
                    "instructions": text,
                    "voice": self.voice,
                },
            }))

            # ---  Déclencher une génération ---
            await ws.send(json.dumps({
                "type": "response.create",
                "response": {"modalities": ["audio"], "instructions": text},
            }))

            # ---  Écouter les messages audio ---
            audio_bytes = b""
            sample_rate = 22050

            async for message in ws:
                data = json.loads(message)

                if data.get("type") == "response.audio.delta":
                    # l'audio est envoyé en base64 -> décodage
                    chunk = base64.b64decode(data["delta"])
                    audio_bytes += chunk

                elif data.get("type") == "response.completed":
                    break

        # Convertir en float32
        audio_np = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0
        return audio_np, sample_rate

    def speak(self, text):
        audio, sr = asyncio.run(self.generate_audio(text))
        audio_int16 = (audio * 32767).astype(np.int16)
        sa.play_buffer(audio_int16, 1, 2, sr).wait_done()

    def save_to_file(self, text, filename="output.wav"):
        audio, sr = asyncio.run(self.generate_audio(text))
        sf.write(filename, audio, sr)
        print(f"Audio saved to {filename}")

if __name__ == "__main__":
    tts = UnmuteTTSClient(ws_url="ws://127.0.0.1:8000/v1/realtime", voice="french_male")
    tts.speak("Bonjour, ceci est un test de synthèse vocale avec Unmute.")
    tts.save_to_file("Bonjour, ceci est un test de synthèse vocale avec Unmute.", "output.wav")
