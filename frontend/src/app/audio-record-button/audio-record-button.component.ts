import {
  Component,
  EventEmitter,
  Output,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { AutomateService } from '../automate.service';
import { AudioRecorderService } from "../services/audio-recorder.service";

@Component({
  selector: "app-audio-record-button",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./audio-record-button.component.html",
})
export class AudioRecordButtonComponent {
  @HostListener("window:keydown", ["$event"])
  handleSpaceShortcut(event: KeyboardEvent) {
    if (event.code === "Space") {
      event.preventDefault(); // prevent default page scroll
      if (!this.isUploading && this.hasMediaDevices) {
        this.onButtonClick();
      }
    }
  }


  @Output() uploadSuccess = new EventEmitter<any>();
  @Output() uploadError = new EventEmitter<any>();

  isRecording = false;
  isUploading = false;
  lastRecordingUrl: string | null = null;

  readonly hasMediaDevices =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function";

  constructor(
    private automate: AutomateService,
    private recorder: AudioRecorderService
  ) {}

  async onButtonClick() {
    if (!this.hasMediaDevices || this.isUploading) return;

    this.isRecording = true;
    try {
      const blob = await this.recorder.recordOnce();
      this.isRecording = false;

      if (this.lastRecordingUrl) {
        URL.revokeObjectURL(this.lastRecordingUrl);
      }
      this.lastRecordingUrl = URL.createObjectURL(blob);

      // for the first evoke with button/spacebar
      this.automate.handleAudioCommand(blob);
      this.uploadSuccess.emit(null);
    } catch (e) {
      this.isRecording = false;
      console.error("Recording error", e);
      this.uploadError.emit(e);
    }
  }
}