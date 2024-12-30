import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { Prompts } from '../model/prompts';

export type PromptOptions<T> = {
  prompts: Prompts;
  structuredOutput: {
    schema: z.Schema<T>;
    schemaName: string;
  };
};

export interface OpenAiService {
  promptAsJson<T>(options: PromptOptions<T>): Promise<T>;
}

export const getOpenAiService = (
  { openai }: { openai: OpenAI },
  seed = 42,
  temperature = 1,
): OpenAiService => {
  const service: OpenAiService = {
    async promptAsJson<T>({ prompts, structuredOutput }: PromptOptions<T>) {
      const messages = buildMessages(prompts);

      const chatCompletion = await openai.chat.completions.create({
        messages,
        model: 'gpt-4o',
        response_format: structuredOutput
          ? zodResponseFormat(
              structuredOutput.schema,
              structuredOutput.schemaName,
            )
          : {
              type: 'json_object',
            },
        temperature,
        seed,
        top_p: 1,
      });

      return processChatCompletionAsJson(chatCompletion);
    },
  };

  return service;
};

const buildMessages = ({
  assistantPrompt,
  developerPrompt,
  userPrompt,
}: Prompts): OpenAI.Chat.Completions.ChatCompletionMessageParam[] => {
  return [
    {
      role: 'user',
      content: userPrompt,
    },
    ...(developerPrompt
      ? [
          {
            role: 'developer',
            content: developerPrompt,
          } satisfies OpenAI.Chat.Completions.ChatCompletionMessageParam,
        ]
      : []),
    ...(assistantPrompt
      ? [
          {
            role: 'assistant',
            content: assistantPrompt,
          } satisfies OpenAI.Chat.Completions.ChatCompletionMessageParam,
        ]
      : []),
  ];
};

const processChatCompletionAsJson = (chatCompletion: OpenAI.ChatCompletion) => {
  if (!chatCompletion.choices.length) {
    throw new Error('Failed to get response from OpenAI: no choices returned.');
  }

  const [firstChoice] = chatCompletion.choices;

  const { content, refusal } = firstChoice.message;

  if (refusal) {
    throw new Error(
      `Failed to get response from OpenAI: refusal message received: ${refusal}`,
    );
  }

  if (!content) {
    throw new Error('Failed to get response from OpenAI: response is empty.');
  }

  return JSON.parse(content);
};
