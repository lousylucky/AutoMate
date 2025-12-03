import { Injectable } from '@angular/core';
import { STTService } from './services/speechRecognition.service';
import { ChatService, ChatState } from './services/chat.service';
import { ToolCall } from '@mistralai/mistralai/models/components';
import { YoutubeSearchService } from './services/youtube-search.service';
import { TTSService } from './services/tts';
import { TrackService } from './services/track.service';
import { Track } from './models/track.model';
import { AudioRecorderService } from './services/audio-recorder.service';
import { YoutubePlayerService } from './services/youtube.service';

@Injectable({
  providedIn: 'root'
})
export class AutomateService {

  private lastFoundTracks: Track[] = [];

  constructor(private stt: STTService, private chat: ChatService, private tts: TTSService, private youtube: YoutubeSearchService, private track: TrackService, private player:YoutubePlayerService, private recorder: AudioRecorderService) { }

  async handleAudioCommand(audio: Blob) {
    console.log("Handle record finish")
    let sttResponse = await this.stt.transcribeChunk(audio).toPromise();
    let commandText = sttResponse!.text;
    console.log(`Transcribed command: ${commandText}`);

    let chatState = this.chat.buildChatState(commandText);
    while (true) {
      let [chatResponse, context] = await this.chat.ask(chatState);

      if (!chatResponse.toolCalls) {
        throw Error("Unimplemented: handle regular messages");
      }

      if (chatResponse.toolCalls.length != 1) {
        throw Error(`Unimplemented: handle multiple tool calls: ${JSON.stringify(chatResponse)}`);
      }

      let call = chatResponse.toolCalls[0];
      let toolResultText = await this.handleToolCall(call);

      if (toolResultText === null) {
        console.log("Conversation end");
        break
      }

      chatState.push({
        role: "tool",
        content: toolResultText,
        name: call.function.name,
        toolCallId: call.id
      });
    }
  }

  private async handleToolCall(call: ToolCall): Promise<string | null> {
    console.log(`Executing command ${call.function.name} with args ${call.function.arguments.toString()}`);

    switch (call.function.name) {

      case 'musicSearch': {
        const query = JSON.parse(call.function.arguments as string).query;

        this.lastFoundTracks = (await this.youtube.search(query, 5).toPromise())!;

        const strippedTracks = this.lastFoundTracks.map(track => ({
          title: track.title,
          artist: track.artist,
          description: track.description,
          videoId: track.videoId,
        }));

        console.log(`YouTube search results for '${query}': ${JSON.stringify(strippedTracks)}`);
        return JSON.stringify(strippedTracks);
      }

      case 'musicLoad': {
        const { videoId } = JSON.parse(call.function.arguments as string);

        console.log(`Playing videoId ${videoId}`);

        const track = this.lastFoundTracks.find(t => t.videoId === videoId) || { videoId };
        this.track.setTrack(track);

        return "success";
      }

      case 'musicPause':
        this.player.pause();
        return "paused";

      case 'musicDownVolume':
        this.player.decreaseVolume(20);
        return "descreasedVolume";
      case 'musicUpVolume':
        this.player.increaseVolume(20);
        return "increaseVolume";
      case 'musicResume':
        this.player.play();
        return "resumed";

      case "speak": {
        const { content } = JSON.parse(call.function.arguments as string);

        console.log(`Synthesizing '${content}' speech to the user`);
        await this.tts.speak(content);

        console.log("Waiting for user's spoken answer...");
        const answerBlob = await this.recorder.recordOnce();

        const answerStt = await this.stt.transcribeChunk(answerBlob).toPromise();
        const answerText = answerStt?.text ?? "";

        console.log(`User answered (STT): ${answerText}`);

        return answerText;
      }

      case 'endConversation':
        return null;
    }

    return null;
  }
}
