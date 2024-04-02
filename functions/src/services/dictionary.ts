import { WordData } from './aiDictionary/model';
import { AiDictionary } from './aiDictionary/aiDictionary';
import { WordDataRepository } from './wordDataRepository';
import { Paywall } from './paywall';

export class UserQuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
  }
}

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
      const cachedWordData = await wordDataRepository.get(word);

      if (cachedWordData) {
        return cachedWordData;
      }

      if (!(await paywall.try(userId))) {
        throw new UserQuotaExceededError(
          'You have exceeded daily usage limit.',
        );
      }

      const wordData = await aiDictionary.getWordData(word);

      await wordDataRepository.add(wordData);

      return wordData;
    },
  };
}
