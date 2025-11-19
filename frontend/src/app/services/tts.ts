import { Injectable } from '@angular/core';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

@Injectable({
  providedIn: 'root',
})
export class Tts {
  private client: ElevenLabsClient;

  constructor() {
    this.client = new ElevenLabsClient({
      apiKey: 'sk_2ec07818d569c978705402f01f3c5daa079f9c4279b6ded5', 
    });
  }

  async speak(text: string, voiceId: string = "FpvROcY4IGWevepmBWO2") {

    const response = await this.client.textToSpeech.convert(
      voiceId,
      {
        text,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128"
      }
    );

    const stream = await response;          // HttpResponse
    const reader = stream.getReader();

    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.play();
  }
}
