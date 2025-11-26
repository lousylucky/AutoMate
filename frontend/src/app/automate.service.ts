import { Injectable } from '@angular/core';
import { STTService } from './services/speechRecognition.service';
import { ChatService, ChatState } from './services/chat.service';
import { ToolCall } from '@mistralai/mistralai/models/components';
import { YoutubeSearchService } from './services/youtube-search.service';

@Injectable({
  providedIn: 'root'
})
export class AutomateService {

  constructor(private stt: STTService, private chat: ChatService, private youtube: YoutubeSearchService) { }

  async handleAudioCommand(audio: Blob) {
    console.log("Handle record finish")
    let sttResponse = await this.stt.transcribeChunk(audio).toPromise();
    let commandText = sttResponse!.text;
    console.log(`Transcribed command: ${commandText}`);

    this.chatLoop(this.chat.buildChatState(commandText));


  }

  private async chatLoop(state: ChatState) {
    let [chatResponse, context] = await this.chat.ask(state);

    if (chatResponse.toolCalls) {
      if (chatResponse.toolCalls.length != 1) {
        throw Error("Unimplemented: handle multiple errors");
      }

      let call = chatResponse.toolCalls[0];
      let toolResultText = await this.handleToolCall(call);

      state.push({ role: "tool", content: toolResultText, name: call.function.name, toolCallId: call.id });
      await this.chatLoop(state);
    } else {
      console.log(`Got text response: ${chatResponse.content}`);
    }
  }

  private async handleToolCall(call: ToolCall): Promise<string> {
    console.log(`Executing command ${call.function.name} with args ${call.function.arguments.toString()}`)
    switch (call.function.name) {
      case 'musicSearch':
        let query = JSON.parse(call.function.arguments as string).query;
        let tracks = await this.youtube.search(query).toPromise();
        console.log(`YouTube search results for '${query}': ${JSON.stringify(tracks)}`);
        return JSON.stringify(tracks)
    }

    return "error";
  }
}
