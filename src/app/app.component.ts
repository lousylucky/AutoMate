import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AudioRecordButtonComponent } from './audio-record-button/audio-record-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HttpClientModule, AudioRecordButtonComponent, CommonModule],
  templateUrl: './app.component.html',
  standalone : true,  
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'autoMate';

    onAudioUploaded(res: any) {
      console.log('Audio uploaded successfully:', res);
  }

  onAudioUploadError(err: any) {
      console.error('Audio upload error:', err);
  }
}
