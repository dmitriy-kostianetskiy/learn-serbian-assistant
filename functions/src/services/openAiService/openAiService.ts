import OpenAI from 'openai';
import { OpenAiService } from './openAiService.model';

export const getOpenAiService = (
  { openai }: { openai: OpenAI },
  seed = 42,
  temperature = 1,
): OpenAiService => {
  return {
    async promptAsJson<T>(prompt: string, systemPrompt?: string) {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
        systemPrompt
          ? [
              {
                role: 'system',
                content: systemPrompt,
              },
            ]
          : [];

      const chatCompletion = await openai.chat.completions.create({
        messages: [
          ...messages,
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-4o',
        response_format: {
          type: 'json_object',
        },
        temperature,
        seed,
        top_p: 1,
      });

      return processChatCompletionAsJson<T>(chatCompletion);
    },
  };
};

const processChatCompletionAsJson = <T>(
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
