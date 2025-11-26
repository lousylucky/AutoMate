import { Injectable } from '@angular/core';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import  environment  from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class Tts {
  private client: ElevenLabsClient;

  constructor() {
    this.client = new ElevenLabsClient({
      apiKey: environment.ELEVENLABS_API_KEY, 
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

    const reader = response.getReader();

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
