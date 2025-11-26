import { Injectable } from '@angular/core';
import { STTService } from './services/speechRecognition.service';
import { ChatService } from './services/chat.service';
import { ToolCall } from '@mistralai/mistralai/models/components';

@Injectable({
  providedIn: 'root'
})
export class AutomateService {

  constructor(private stt: STTService, private chat: ChatService) { }

  async handleAudioCommand(audio: Blob) {
    console.log("Handle record finish")
    let sttResponse = await this.stt.transcribeChunk(audio).toPromise();
    let commandText = sttResponse!.text;
    console.log(`Transcribed command: ${commandText}`);

    let [chatResponse, context] = await this.chat.ask([{ role: "user", content: commandText }]);

    if (chatResponse.toolCalls) {
      if (chatResponse.toolCalls.length != 1) {
        throw Error("Unimplemented: handle multiple errors");
      }

      let call = chatResponse.toolCalls[0];
      this.handleToolCall(call);
    } else {
      console.log(`Got text response: ${chatResponse.content}`);
    }

  }

  async handleToolCall(call: ToolCall) {
    console.log(`Executing command ${call.function.name} with args ${call.function.arguments.toString()}`)
    // TODO
  }
}
