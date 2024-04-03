import { AiDictionary } from './aiDictionary/aiDictionary';
import { WordData } from './aiDictionary/model';
import {
  Dictionary,
  UserQuotaExceededError,
  getDictionary,
} from './dictionary';
import { Paywall } from './paywall';
import { WordDataRepository } from './wordDataRepository';

describe('Dictionary', () => {
  let aiDictionary: AiDictionary;
  let wordDataRepository: WordDataRepository;
  let dictionary: Dictionary;
  let paywall: Paywall;

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

    paywall = {
      try: jest.fn(async (userId) => {
        if (userId === 'good') {
          return true;
        }

        return false;
      }),
      reset: jest.fn(),
    };

    dictionary = getDictionary(aiDictionary, wordDataRepository, paywall);
  });

  test('should not do AI call when word is cached', async () => {
    // Arrange & Act
    const wordData = await dictionary.getWordData('cached', 'good');

    // Assert
    expect(wordData).toBeTruthy();
    expect(aiDictionary.getWordData).not.toHaveBeenCalled();
    expect(wordDataRepository.add).not.toHaveBeenCalled();
  });

  test('should do AI call and cache the value when word is not cached', async () => {
    // Arrange & Act
    const wordData = await dictionary.getWordData('not-cached', 'good');

    // Assert
    expect(wordData).toBeTruthy();
    expect(aiDictionary.getWordData).toHaveBeenCalled();
    expect(wordDataRepository.add).toHaveBeenCalled();
  });

  test('should not do AI call when user exceeded daily limit', async () => {
    // Assert
    await expect(async () => {
      await dictionary.getWordData('not-cached', 'bad');
    }).rejects.toThrow(
      new UserQuotaExceededError(
        'You have exceeded daily usage limit. Please try again tomorrow.',
      ),
    );
  });
});
