import { AiDictionary } from './aiDictionary';
import { WordData } from './aiDictionary/model';
import { Dictionary, getDictionary } from './dictionary';
import { WordDataRepository } from './wordDataRepository';

describe('dictionary', () => {
  let aiDictionary: AiDictionary;
  let wordDataRepository: WordDataRepository;
  let dictionary: Dictionary;

  beforeEach(() => {
    aiDictionary = {
      getWordData: jest.fn(async (word) => ({ word }) as WordData),
    };

    wordDataRepository = {
      get: jest.fn(async (word) => {
        if (word === 'cached') {
          return {
            word: 'cached',
          } as WordData;
        }

        return undefined;
      }),
      add: jest.fn(),
    };

    dictionary = getDictionary(aiDictionary, wordDataRepository);
  });

  test('should not do AI call when word is cached', async () => {
    // Arrange & Act
    const wordData = await dictionary.getWordData('cached');

    // Assert
    expect(wordData).toBeTruthy();
    expect(aiDictionary.getWordData).not.toHaveBeenCalled();
    expect(wordDataRepository.add).not.toHaveBeenCalled();
  });

  test('should do AI call and cache the value when word is not cached', async () => {
    // Arrange & Act
    const wordData = await dictionary.getWordData('not-cached');

    // Assert
    expect(wordData).toBeTruthy();
    expect(aiDictionary.getWordData).toHaveBeenCalled();
    expect(wordDataRepository.add).toHaveBeenCalled();
  });
});
