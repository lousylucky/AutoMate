import {
  Component,
  EventEmitter,
  Output,
  OnDestroy,
  HostListener,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { AutomateService } from '../automate.service';
import { YoutubePlayerService } from "../services/youtube.service";
import { take } from "rxjs";

@Component({
  selector: "app-audio-record-button",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./audio-record-button.component.html",
})
export class AudioRecordButtonComponent implements OnDestroy {

  @HostListener("window:keydown", ["$event"])
  handleSpaceShortcut(event: KeyboardEvent) {
    if (event.code === "Space") {
      event.preventDefault(); // prevent default page scroll 
      if (!this.isUploading && this.hasMediaDevices) {
        this.onButtonClick();
      }
    }
  }

  /** Endpoint where the audio file will be uploaded */
  readonly uploadUrl = "/api/audio/upload";

  /** Events emitted to the parent component (e.g. for showing a toast) */
  @Output() uploadSuccess = new EventEmitter<any>();
  @Output() uploadError = new EventEmitter<any>();

  /** UI state flags */
  isRecording = false;
  isUploading = false;
  lastRecordingUrl: string | null = null;

  /** Wether the current recording had to plause the player */
  private pausedPlayer = false;

  /** Used in the template instead of `'mediaDevices' in navigator` */
  readonly hasMediaDevices =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function";

  /** Internal recording state */
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];
  private stream: MediaStream | null = null;

  constructor(private http: HttpClient, private automate: AutomateService, private player: YoutubePlayerService) { }

  async onButtonClick() {
    if (!this.hasMediaDevices || this.isUploading) return;

    if (!this.isRecording) {
      await this.startRecording();
      this.player.isPlaying$.pipe(take(1)).subscribe(isPlaying => {
        this.pausedPlayer = isPlaying;
        if (isPlaying) {
          this.player.pause();
        }
      });
    } else {
      this.stopRecording();
      if (this.pausedPlayer) {
        this.player.play();
      }
    }
  }

  private async startRecording() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Your browser does not support audio recording.");
        return;
      }

      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.chunks = [];

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: "audio/webm",
      });

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data?.size > 0) {
          this.chunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.handleRecordingStop();
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (err) {
      console.error("Microphone / MediaRecorder error:", err);
      alert("Cannot access the microphone.");
    }
  }

  private stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;

    // Stop microphone stream
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  private handleRecordingStop() {
    const blob = new Blob(this.chunks, { type: "audio/webm" });

    // Update preview of the last recording
    if (this.lastRecordingUrl) {
      URL.revokeObjectURL(this.lastRecordingUrl);
    }
    this.lastRecordingUrl = URL.createObjectURL(blob);

    this.automate.handleAudioCommand(blob);
  }

  ngOnDestroy() {
    // Clean up resources when the component is destroyed
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    if (this.lastRecordingUrl) {
      URL.revokeObjectURL(this.lastRecordingUrl);
    }
  }
}
