import { Injectable } from '@angular/core';
import { Mistral } from '@mistralai/mistralai';

import environment from '../../environments/environment';
import { AssistantMessage, ChatCompletionRequest, Tool } from '@mistralai/mistralai/models/components';

export type ChatState = ChatCompletionRequest["messages"];

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
              description: 'The search query',
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
              description: 'The youtube video id',
            },
          },
          required: ['videoId'],
        },
      }
    },
    {
      type: "function",
      function: {
        name: "speak",
        description: "Speak to the user, and get a response",
        parameters: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The speech content',
            },
          },
          required: ['content'],
        },
      }
    },
    {
      type: "function",
      function: {
        name: "endConversation",
        description: "End the conversation with the user",
        parameters: {},
      }
    }
  ];

  constructor() {
    const apiKey = environment.MISTRAL_API_KEY;
    this.client = new Mistral({ apiKey: apiKey });
  }

buildChatState(firstMessage: string): ChatState {
  return [
    {
      role: "system",
      content: `
You are a minimal voice music assistant.

- Your primary job is to use the tools musicSearch and musicPlay.
- Do NOT chat with the user, do NOT explain what you are doing.
- When the user asks to play some music (e.g. "play Michaela Jacksona", "met moi Billie Jean"):
  - Immediately call musicSearch with a good search query.
  - Then, based on the results, call musicPlay for the best match.
- Only call speak when you really need extra clarification.
- Prefer choosing the first reasonable track instead of asking questions.
- End the conversation with endConversation as soon as the command is handled.
- User speak only French or English 
      `.trim()
    },
    { role: "user", content: firstMessage }
  ];
}

  async ask(messages: ChatState): Promise<[AssistantMessage, ChatState]> {
    console.debug("Calling ask with state ", JSON.stringify(messages))
    const chatResponse = await this.client.chat.complete({
      model: 'ministral-3b-2410',
      tools: this.tools,
      toolChoice: "any",
      messages,
    });
    const finalResponse = chatResponse.choices[0].message;
    // @ts-ignore
    messages.push(finalResponse);

    return [finalResponse, messages];
  }
}
