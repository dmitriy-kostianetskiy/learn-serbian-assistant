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
    'Field "partOfSpeech" should contain part of speech. "partOfSpeech" only can be "verb", "noun" or "other".',
    'If it is a verb then field "conjugations" should contain two subfields "singluar" for conjugations for singular and "plural" for conjugations for plural.',
    'If it is a verb then "infinitive" should contain infinitive.',
    'If it is a noun then field "cases" should contain two subfields: "singluar" for cases in singular and "plural" for cases in plural. DO NOT add any prepositions.',
    'Field "definition" should contain definition of the word in serbian, english and russian.',
    'Field "translation" should contain translation fo the input word in english and russian.',
    'Field "synonyms" should contain a few synonyms in Serbian',
    'Field "example" should contain an example of usage of the word in Serbian',
    'Field "grammaticalNumber" should contain grammatical number of an input word as a string "množina" or "jednina"',
    'Field "grammaticalGender" should contain grammatical gender of a given word as a string "muški", "ženski" or "srednji"',
    `Print results in JSON with the following structure:\n${STRINGIFIED_EXAMPLE}`,
  ].join('\n');
}
