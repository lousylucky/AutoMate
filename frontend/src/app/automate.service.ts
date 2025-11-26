import { Injectable } from '@angular/core';
import { STTService } from './services/speechRecognition.service';
import { ChatService, ChatState } from './services/chat.service';
import { ToolCall } from '@mistralai/mistralai/models/components';
import { YoutubeSearchService } from './services/youtube-search.service';
import { YoutubePlayerService } from './services/youtube.service';
import { TTSService } from './services/tts';

@Injectable({
  providedIn: 'root'
})
export class AutomateService {

  constructor(private stt: STTService, private chat: ChatService, private tts: TTSService, private youtube: YoutubeSearchService, private player: YoutubePlayerService) { }

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
        let query = JSON.parse(call.function.arguments as string).query;
        let tracks = await this.youtube.search(query, 5).toPromise();
        console.log(`YouTube search results for '${query}': ${JSON.stringify(tracks)}`);
        return JSON.stringify(tracks)

      case 'musicPlay':
        let videoId = JSON.parse(call.function.arguments as string).videoId;
        console.log(`Playing videoId ${videoId}`);
        this.player.load(videoId);
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
