import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Track } from '../models/track.model';
import { TrackService } from '../services/track.service';
import { YoutubePlayerService } from '../services/youtube.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music.component.html'
})
export class PlayerComponent implements OnInit {
  currentTrack$!: Observable<Track | null>;
  isPlaying$!: Observable<boolean>;

  currentTime$!: Observable<number>;
  duration$!: Observable<number>;

  constructor(
    private trackService: TrackService,
    private youtubePlayer: YoutubePlayerService
  ) {}

  ngOnInit(): void {
    this.currentTrack$ = this.trackService.currentTrack$;
    this.isPlaying$ = this.youtubePlayer.isPlaying$;
    this.currentTime$ = this.youtubePlayer.currentTime$;
    this.duration$ = this.youtubePlayer.duration$;

    this.youtubePlayer.initPlayer('yt-hidden-player');

    // na razie dev symulacja
    this.trackService.devSimulateIncomingTrack();
  }

  togglePlay() {
    this.youtubePlayer.togglePlayPause();
  }

  // format czasu mm:ss
  formatTime(seconds: number | null | undefined): string {
    if (!seconds || seconds < 0) return '0:00';
    const s = Math.floor(seconds % 60);
    const m = Math.floor(seconds / 60);
    const sStr = s.toString().padStart(2, '0');
    return `${m}:${sStr}`;
  }
}