import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import environment from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class STTService {
  private apiUrl = "https://api.mistral.ai/v1/audio/transcriptions";

  private apiKey = environment.STT_API_KEY ;

  constructor(private http: HttpClient) { }

  transcribeChunk(blob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append("file", blob, "chunk.webm");
    formData.append("language", "fr");
    formData.append("model", "voxtral-mini-latest");

    return this.http.post(this.apiUrl, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.apiKey}`,
      }),
    });
  }
}
