import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, take } from 'rxjs';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

@Injectable({ providedIn: 'root' })
export class YoutubePlayerService {
  private player?: any;

  private apiReady$ = new ReplaySubject<boolean>(1);

  private currentVideoIdSubject = new BehaviorSubject<string | null>(null);
  currentVideoId$ = this.currentVideoIdSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  // czas i długość
  private currentTimeSubject = new BehaviorSubject<number>(0);
  currentTime$ = this.currentTimeSubject.asObservable();

  private durationSubject = new BehaviorSubject<number>(0);
  duration$ = this.durationSubject.asObservable();

  // zapamiętane ostatnie videoId (na wypadek, gdyby load() przyszło przed init playera)
  private lastVideoId: string | null = null;

  // timer do aktualizacji progresu
  private progressTimer: any;

  constructor() {
    this.loadApi();
  }

  /** Ładuje iframe API (raz na całą aplikację) */
  private loadApi() {
    if (window.YT && window.YT.Player) {
      this.apiReady$.next(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      this.apiReady$.next(true);
    };
  }

  /** called by component */
  initPlayer(elementId: string) {
    this.apiReady$.pipe(take(1)).subscribe(() => {
      this.player = new window.YT.Player(elementId, {
        height: '0',      // masked player
        width: '0',
        playerVars: {
          controls: 0,
          modestbranding: 1
        },
        events: {
          onReady: () => {
            // gdy player gotowy, zaczynamy aktualizować progres
            this.startProgressTimer();

            // jeśli było już jakieś video ustawione wcześniej – od razu je odpal
            if (this.lastVideoId) {
              this.player.loadVideoById(this.lastVideoId);
              this.player.playVideo();
            }
          },
          onStateChange: (event: any) => this.handleStateChange(event)
        }
      });
    });
  }

  private handleStateChange(event: any) {
    const state = event.data;
    // PLAYING = 1, PAUSED = 2, ENDED = 0
    if (state === window.YT.PlayerState.PLAYING) {
      this.isPlayingSubject.next(true);
    } else if (
      state === window.YT.PlayerState.PAUSED ||
      state === window.YT.PlayerState.ENDED
    ) {
      this.isPlayingSubject.next(false);
    }
  }

  // timer aktualizujący currentTime i duration
  private startProgressTimer() {
    if (this.progressTimer) return;

    this.progressTimer = setInterval(() => {
      if (!this.player) return;
      try {
        const current = this.player.getCurrentTime?.() ?? 0;
        const duration = this.player.getDuration?.() ?? 0;

        this.currentTimeSubject.next(current || 0);
        this.durationSubject.next(duration || 0);
      } catch {
        // YouTube czasem rzuca błędem zanim się do końca zainicjalizuje
      }
    }, 500);
  }

  load(videoId: string) {
    this.lastVideoId = videoId;
    this.currentVideoIdSubject.next(videoId);

    if (this.player) {
      this.player.loadVideoById(videoId);
      this.player.playVideo();
    }
  }

  play() {
    if (this.player) {
      this.player.playVideo();
    }
  }

  pause() {
    if (this.player) {
      this.player.pauseVideo();
    }
  }

  togglePlayPause() {
    if (!this.player) return;

    const state = this.player.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      this.pause();
    } else {
      this.play();
    }
  }
}