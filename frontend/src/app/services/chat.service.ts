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
        name: "musicLoad",
        description: "Load a music from Youtube. Automatically launches playback",
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
        name: "musicPause",
        description: "Pause music playback",
        parameters: {},
      }
    },
    {
      type: "function",
      function: {
        name: "musicResume",
        description: "Resume music playback",
        parameters: {},
      },
    },
    {
      type: "function",
      function: {
        name: "musicDownVolume",
        description: "Turn down the music",
        parameters: {},
      },
    },
    {
      type: "function",
      function: {
        name: "musicUpVolume",
        description: "Turn up the music",
        parameters: {},
      },
    },
    {
      type: "function",
      function: {
        name: "endConversation",
        description: "End the conversation with the user",
        parameters: {},
      },
    },
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
You are a minimal voice assistant used for controlling a music player.

- Your primary job is to use the provided tools based on user commands
- Do NOT chat with the user, do NOT explain what you are doing
- The user usually asks one thing at a time
- If the user ask to change volume don't change the current music
- If the user ask to toggle playback don't change the current music
- When the user asks to put some music:
  - Keep in mind that the user might just want to toggle playback using musicResume or change the volume of the music with musicUpVolume or musicDownVolume
  - Immediately call musicSearch with a good search query
  - Then, based on the results, call musicLoad for the best match
- Only call speak when you really need extra clarification
- Prefer choosing the first reasonable track instead of asking questions
- End the conversation with endConversation as soon as the command is handled
- User speaks only French or English
- Do not call multiple tools at once
- Do not annoy the user, speak short and concise answers, if he tells you to do nothing or shut up, call endConversation
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
