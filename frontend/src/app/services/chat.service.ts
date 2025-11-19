import { Injectable } from '@angular/core';
import { Mistral } from '@mistralai/mistralai';

import environment from '../../environments/environment';
import { AssistantMessage, ChatCompletionRequest, Tool } from '@mistralai/mistralai/models/components';

type ChatState = ChatCompletionRequest["messages"];

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client: Mistral;
  private tools: Tool[] = [
    {
      type: "function",
      function: {
        name: "musicSearch",
        description: "Search for a music on YouTube and get multiple results",
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query.',
            },
          },
          required: ['query'],
        },
      }
    },
    {
      type: "function",
      function: {
        name: "musicPlay",
        description: "Start music playback",
        parameters: {
          type: 'object',
          properties: {
            videoId: {
              type: 'string',
              description: 'The youtube video id.',
            },
          },
          required: ['query'],
        },
      }
    }
  ];

  constructor() {
    const apiKey = environment.MISTRAL_API_KEY;
    this.client = new Mistral({ apiKey: apiKey });
  }

  async ask(messages: ChatState): Promise<[AssistantMessage, ChatState]> {
    console.log("Calling ask with state ", JSON.stringify(messages))
    const chatResponse = await this.client.chat.complete({
      model: 'ministral-3b-2410',
      tools: this.tools,
      messages,
    });
    const finalResponse = chatResponse.choices[0].message;
    // @ts-ignore
    messages.push(finalResponse);

    return [finalResponse, messages];
  }

}
