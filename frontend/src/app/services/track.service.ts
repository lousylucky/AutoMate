import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../models/track.model';
import { YoutubePlayerService } from './youtube.service';

@Injectable({ providedIn: 'root' })
export class TrackService  {
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();

  constructor(private youtubePlayer: YoutubePlayerService) {}
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
