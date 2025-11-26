import { Injectable } from '@angular/core';
import { STTService } from './services/speechRecognition.service';
import { ChatService, ChatState } from './services/chat.service';
import { ToolCall } from '@mistralai/mistralai/models/components';
import { YoutubeSearchService } from './services/youtube-search.service';
import { TTSService } from './services/tts';
import { TrackService } from './services/track.service';
import { Track } from './models/track.model';

@Injectable({
  providedIn: 'root'
})
export class AutomateService {

  private lastFoundTracks: Track[] = [];
  
  constructor(private stt: STTService, private chat: ChatService, private tts: TTSService, private youtube: YoutubeSearchService, private player: TrackService) { }

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

      chatState.push({ role: "tool", content: toolResultText, name: call.function.name, toolCallId: call.id });
    }
  }

  private async handleToolCall(call: ToolCall): Promise<string | null> {
    console.log(`Executing command ${call.function.name} with args ${call.function.arguments.toString()}`)
    switch (call.function.name) {
      case 'musicSearch':
        const query = JSON.parse(call.function.arguments as string).query;
        this.lastFoundTracks = (await this.youtube.search(query, 5).toPromise())!;
        // Remove useless stuff from context
        const strippedTracks= this.lastFoundTracks.map(track => {
          return {
            title: track.title,
            artist: track.artist,
            description: track.description,
            videoId:  track.videoId,
          }
        });
        console.log(`YouTube search results for '${query}': ${JSON.stringify(strippedTracks)}`);
        return JSON.stringify(strippedTracks)

      case 'musicPlay':
        let videoId = JSON.parse(call.function.arguments as string).videoId;
        console.log(`Playing videoId ${videoId}`);
        const track = this.lastFoundTracks.find(track => track.videoId == videoId) || {
          videoId: videoId
        };
        this.player.setTrack(track);
        return "success";

      case 'speak':
        let speechText = JSON.parse(call.function.arguments as string).content;
        console.log(`Synthetising '${speechText}' speeck to the user`);
        await this.tts.speak(speechText);
        console.log("TODO: Start recording");
        return "Oui stp";

      case 'endConversation':
        return null;
    }

    return null;
  }
}
