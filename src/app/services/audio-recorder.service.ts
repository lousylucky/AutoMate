import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];
  private stream: MediaStream | null = null;

  async recordOnce(): Promise<Blob> {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      throw new Error("Your browser does not support audio recording.");
    }

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.chunks = [];

    return new Promise<Blob>((resolve, reject) => {
      try {
        this.mediaRecorder = new MediaRecorder(this.stream as MediaStream, {
          mimeType: "audio/webm",
        });

        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
          if (event.data?.size > 0) {
            this.chunks.push(event.data);
          }
        };

        this.mediaRecorder.onerror = (err) => {
          console.error("MediaRecorder error:", err);
          this.cleanup();
          reject(err);
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.chunks, { type: "audio/webm" });
          this.cleanup();
          resolve(blob);
        };

        this.mediaRecorder.start();

        // Prosty wariant: nagrywamy maksymalnie 5 sekund
        setTimeout(() => {
          if (
            this.mediaRecorder &&
            this.mediaRecorder.state === "recording"
          ) {
            this.mediaRecorder.stop();
          }
        }, 5000);
      } catch (e) {
        this.cleanup();
        reject(e);
      }
    });
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.chunks = [];
  }
}