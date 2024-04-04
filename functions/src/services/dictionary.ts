import { WordData } from './aiDictionary/model';
import { AiDictionary } from './aiDictionary/aiDictionary';
import { WordDataRepository } from './wordDataRepository';
import { Paywall } from './paywall';

export interface Dictionary {
  getWordData(word: string, userId: string): Promise<WordData>;
}

export function getDictionary(
  aiDictionary: AiDictionary,
  wordDataRepository: WordDataRepository,
  paywall: Paywall,
): Dictionary {
  return {
    getWordData: async (word: string, userId: string) => {
      // if the word is cached that return it
      const cachedWordData = await wordDataRepository.get(word);

      if (cachedWordData) {
        console.log(
          `Word data for word '${word}' for user ${userId}: found in cache.`,
        );

        return cachedWordData;
      }

      console.log(
        `Word data for word '${word}' for user ${userId}: is not found in cache, trying to pass paywall.`,
      );

      await paywall.pass(userId);

      // get the word data from OpenAI and add to cache
      console.log(
        `Word data for word '${word}' for user ${userId}: requested from OpenAI.`,
      );

      const wordData = await aiDictionary.getWordData(word);

      console.log(
        `Word data for word '${word}' for user ${userId}: received from OpenAI.`,
      );

      await wordDataRepository.add(wordData);

      console.log(`Word data for word '${word}' for user ${userId}: cached.`);

      return wordData;
    },
  };
}
