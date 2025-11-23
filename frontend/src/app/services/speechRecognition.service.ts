import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class STTService {
  private apiUrl =
    "https://docs.mistral.ai/models/voxtral-mini-transcribe-25-07";
  private apiKey = "API_STT";

  constructor(private http: HttpClient) {}

  transcribeChunk(blob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append("file", blob, "chunk.webm");
    formData.append("model", "default");

    return this.http.post(this.apiUrl, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.apiKey}`,
      }),
    });
  }
}
