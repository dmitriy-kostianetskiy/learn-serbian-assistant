import OpenAI from 'openai';
import { WordData } from './model';
import { STRINGIFIED_EXAMPLE } from './example';
import { Config } from '../config';
import { substitutePlaceholders } from '../../utils/substitutePlaceholders';

export interface AiDictionary {
  getWordData(word: string): Promise<WordData>;
}

export function getAiDictionary(
  openai: OpenAI,
  config: Config,
  openAiSeed = 42,
): AiDictionary {
  return {
    getWordData: async (word: string) => {
      const promptTemplate = await config.getWordDataPrompt();
      const prompt = substitutePlaceholders(promptTemplate, {
        word,
        example: STRINGIFIED_EXAMPLE,
      });

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
        seed: openAiSeed,
      });

      return processChatCompletionAsJson(chatCompletion);
    },
  };
}

function processChatCompletionAsJson<T extends object>(
  chatCompletion: OpenAI.ChatCompletion,
): T {
  if (!chatCompletion.choices.length) {
    throw new Error('Failed to get response from OpenAI: no choices returned.');
  }

  const [firstChoice] = chatCompletion.choices;

  const content = firstChoice.message.content;

  if (!content) {
    throw new Error('Failed to get response from OpenAI: response is empty.');
  }

  return JSON.parse(content) as T;
}
