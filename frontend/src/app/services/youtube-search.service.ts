import { inject, Injectable } from "@angular/core";
import environment from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Track } from "../models/track.model";

@Injectable({
  providedIn: "root",
})
export class YoutubeSearchService {
  constructor() {}

  private readonly apiKey = environment.GOOGLE_API_KEY;
  private readonly apiVersion = "v3";

  private readonly http = inject(HttpClient);

  private apiUrl = `https://www.googleapis.com/youtube/${this.apiVersion}/search`;

  /**
   * Search youtube videos based on a string query
   * @param {string} q - query
   * @param {number} maxResults - the number of result max returned (by default 25)
   * @returns {Track[]} track lists
   */
  search(q: string, maxResults: number = 25): Observable<Track[]> {
    const params = {
      q,
      part: "snippet",
      type: "video",
      maxResults,
      key: this.apiKey,
    };

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response) =>
        response.items.map((item: any) => ({
          title: item.snippet.title,
          description: item.snippet.description,
          videoId: item.id.videoId,
          thumbnailUrl: item.snippet.thumbnails.high ?  item.snippet.thumbnails.high.url : item.snippet.thumbnails.default.url,
          artist: item.snippet.channelTitle,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }))
      )
    );
  }
}
