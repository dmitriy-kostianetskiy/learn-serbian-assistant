import { openai } from '../openai';
import OpenAI from 'openai';
import { AssistantOutput } from './model';
import { STRINGIFIED_EXAMPLE } from './example';

export async function assist(word: string): Promise<AssistantOutput> {
  const prompt = generatePrompt(word);

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
  });

  return processChatCompletionAsJson(chatCompletion);
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

function generatePrompt(word: string): string {
  return [
    `Figure out what part of speech Serbian word "${word}" is.`,
    'If it is a verb then generate conjugations.',
    'If it is a noun then generate cases.',
    'Provide translation to english and russian.',
    `Print results in JSON with the following structure:\n${STRINGIFIED_EXAMPLE}`,
  ].join('\n');
}
