import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Track } from '../models/track.model';
import { YoutubePlayerService } from './youtube.service';

interface ServerMessage {
  type: string;
  payload?: any;
}

const WS_URL = 'ws://localhost:3000/ws'

@Injectable({ providedIn: 'root' })
export class TrackService  {
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();

  // WebSocket
  private socket$: WebSocketSubject<ServerMessage> | null = null;
  private socketSub?: Subscription;
  private reconnectSub?: Subscription;

  constructor(
    private youtubePlayer: YoutubePlayerService
  ) {
  // TODO: turn on when backend ready 
  // this.connectWebSocket();
  }

  private connectWebSocket() {
    if (this.socket$ && !this.socket$.closed) {
      return
    }

    console.log('[TrackService] Connecting WebSocket to', WS_URL);
    this.socket$ = webSocket<ServerMessage>(WS_URL);

    this.socketSub = this.socket$.subscribe({
      next: (msg) => this.handleServerMessage(msg),
      error: (err) => {
        console.error('[TrackService] WebSocket error', err);
        this.scheduleReconnect();
      },
      complete: () => {
        console.warn('[TrackService] WebSocket completed/closed');
        this.scheduleReconnect();
      }
    });
  }

  private scheduleReconnect() {
    if (this.reconnectSub) {
      return
    }

    console.log('[TrackService] Reconnecting in 3s...');
    this.reconnectSub = timer(3000).subscribe(() => {
      this.reconnectSub = undefined;
      this.connectWebSocket();
    });
  }

  private handleServerMessage(msg: ServerMessage) {
    switch (msg.type) {
      case 'track-found': {
        const track = msg.payload as Track;
        if (!track) {
          console.warn('[TrackService] track-found bez payload');
          return;
        }
        this.setTrack(track);
        break;
      }
      case 'error': {
        console.error('[TrackService] Error from server:', msg.payload);
        break;
      }
      default:
        console.log('[TrackService] Unknown message type', msg);
    }
  }
  setTrack(track: Track) {
    this.currentTrackSubject.next(track);
    this.youtubePlayer.load(track.videoId);
  }

  devSimulateIncomingTrack() {
  const fakeTrack: Track = {
    title: 'Talk of the Town (Dublin, 30th October 2025)',
    artist: 'Fred again.., Sammy Virji, Reggie ',
    videoId: 'R-u5i-_eycw', 
    thumbnailUrl: 'https://i.scdn.co/image/ab67616d0000b273c50ae468aa0a83676323fdcb'
  };

  console.log('[TrackService] devSimulateIncomingTrack()', fakeTrack);
  this.setTrack(fakeTrack);
}

}
