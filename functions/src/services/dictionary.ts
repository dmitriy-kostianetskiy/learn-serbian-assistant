import { WordData } from './aiDictionary/model';
import { AiDictionary } from './aiDictionary/aiDictionary';
import { WordDataRepository } from './wordDataRepository';

export interface Dictionary {
  getWordData(word: string): Promise<WordData>;
}

export function getDictionary(
  aiDictionary: AiDictionary,
  wordDataRepository: WordDataRepository,
): Dictionary {
  return {
    getWordData: async (word: string) => {
      const cachedWordData = await wordDataRepository.get(word);

      if (cachedWordData) {
        return cachedWordData;
      }

      const wordData = await aiDictionary.getWordData(word);

      await wordDataRepository.add(wordData);

      return wordData;
    },
  };
}
