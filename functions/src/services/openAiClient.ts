import OpenAI from 'openai';
import { Dependencies } from '../dependencies';

export interface OpenAiClient {
  promptAsJson<T extends object>(prompt: string): Promise<T>;
}

export const getOpenAiClient = (
  { openai }: Pick<Dependencies, 'openai'>,
  seed = 42,
  temperature = 0.2,
): OpenAiClient => {
  return {
    promptAsJson: async <T extends object>(prompt: string) => {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-3.5-turbo',
        response_format: {
          type: 'json_object',
        },
        temperature,
        seed,
      });

      return processChatCompletionAsJson<T>(chatCompletion);
    },
  };
};

const processChatCompletionAsJson = <T extends object>(
  chatCompletion: OpenAI.ChatCompletion,
): T => {
  if (!chatCompletion.choices.length) {
    throw new Error('Failed to get response from OpenAI: no choices returned.');
  }

  const [firstChoice] = chatCompletion.choices;

  const content = firstChoice.message.content;

  if (!content) {
    throw new Error('Failed to get response from OpenAI: response is empty.');
  }

  return JSON.parse(content) as T;
};
