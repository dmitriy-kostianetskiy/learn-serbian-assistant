import OpenAI from 'openai';
import { AiDictionary, getAiDictionary } from './aiDictionary';
import { CasesOutput, ConjugationsOutput } from './model';

const TIMEOUT = 15_000;

describe('AiDictionary', () => {
  let aiDictionary: AiDictionary;

  beforeAll(() => {
    aiDictionary = getAiDictionary(
      new OpenAI({ apiKey: process.env.OPEN_AI_KEY }),
    );
  });

  test(
    'should recognize verb and provide conjugations',
    async () => {
      // Arrange & Act
      const wordData = await aiDictionary.getWordData('dati');

      console.log(wordData);

      // Assert
      expect(wordData).toBeTruthy();
      expect(wordData.partOfSpeech).toBe('verb');
      expect(wordData.example).toBeTruthy();

      if (wordData.partOfSpeech === 'verb') {
        const expectedConjugations: ConjugationsOutput = {
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

        expect(wordData.conjugations).toMatchObject(expectedConjugations);
        expect(wordData.infinitive).toBe('dati');
        expect(wordData.synonyms).not.toHaveLength(0);
      }
    },
    TIMEOUT,
  );

  test(
    'should recognize noun and provide cases',
    async () => {
      // Arrange & Act
      const wordData = await aiDictionary.getWordData('sto');

      console.log(wordData);

      // Assert
      expect(wordData).toBeTruthy();
      expect(wordData.partOfSpeech).toBe('noun');
      expect(wordData.example).toBeTruthy();
      expect(wordData.grammaticalGender).toBeTruthy();
      expect(wordData.grammaticalNumber).toBeTruthy();

      if (wordData.partOfSpeech === 'noun') {
        const expectedCases: CasesOutput = {
          singular: {
            nominative: 'sto',
            genitive: 'stola',
            dative: 'stolu',
            accusative: 'sto',
            instrumental: 'stolom',
            locative: 'stolu',
            vocative: 'sto',
          },
          plural: {
            nominative: 'stolovi',
            genitive: 'stolova',
            dative: 'stolovima',
            accusative: 'stolove',
            instrumental: 'stolovima',
            locative: 'stolovima',
            vocative: 'stolovi',
          },
        };

        expect(wordData.cases).toMatchObject(expectedCases);
        expect(wordData.synonyms).not.toHaveLength(0);
      }
    },
    TIMEOUT,
  );
});
