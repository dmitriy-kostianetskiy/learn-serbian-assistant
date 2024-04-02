import OpenAI from 'openai';
import { WordData } from './model';
import { STRINGIFIED_EXAMPLE } from './example';

export interface AiDictionary {
  getWordData(word: string): Promise<WordData>;
}

export function getAiDictionary(openai: OpenAI, openAiSeed = 42): AiDictionary {
  return {
    getWordData: async (word: string) => {
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

function generatePrompt(word: string): string {
  return [
    `Generate a JSON containing the following information about the word "${word}" in Serbian.`,
    'Save a part of speech in a field "partOfSpeech". KEEP IN MIND "partOfSpeech" only can be "verb", "noun" or "other"',
    'If it is a verb then generate conjugations for all grammatical genders and grammatical numbers.',
    'If it is a verb then also provide infinitive.',
    'If it is a noun then generate cases for singular and plural, DO NOT add any prepositions.',
    'Provide definition of the word in serbian, english and russian.',
    'Provide translation to english and russian.',
    'Provide a few synonyms in Serbian',
    'Provide an example of usage of the word in Serbian',
    'Provide grammatical number of a given word as a string "množina" or "jednina"',
    'Provide grammatical gender of a given word as a string "muški", "ženski" or "srednji"',
    `Print results in JSON with the following structure:\n${STRINGIFIED_EXAMPLE}`,
  ].join('\n');
}
