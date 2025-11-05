import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
})
export class MusicComponent {
  currentVideoId: string | null = null;
  embedUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  play(videoId: string) {
    this.currentVideoId = videoId;
    const url = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}