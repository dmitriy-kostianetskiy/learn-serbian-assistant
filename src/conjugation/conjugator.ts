import { openai } from '../openai';
import OpenAI from 'openai';
import { ConjugationOutput } from './model';

const EXAMPLE: ConjugationOutput = {
  singular: {
    first: 'dajem',
    second: 'daješ',
    third: 'daje',
  },
  plural: {
    first: 'dajemo',
    second: 'dajete',
    third: 'daju',
  },
};

const STRINGIFIED_EXAMPLE = JSON.stringify(EXAMPLE);

export async function conjugate(verb: string): Promise<ConjugationOutput> {
  const prompt = generatePrompt(verb);

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

function generatePrompt(verb: string): string {
  return `Conjugate Serbian verb "${verb}". Print results in JSON with the following structure: ${STRINGIFIED_EXAMPLE}`;
}
