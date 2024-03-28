import { AssistantOutput } from './model';

export const EXAMPLE: AssistantOutput[] = [
  {
    word: 'dati',
    partOfSpeech: 'verb',
    translation: {
      english: 'to give',
      russian: 'давать',
    },
    conjugations: {
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
    },
  },
  {
    word: 'dete',
    partOfSpeech: 'noun',
    translation: {
      english: 'child',
      russian: 'ребенок',
    },
    cases: {
      singular: {
        nominative: 'dete',
        genitive: 'deteta',
        dative: 'detetu',
        accusative: 'dete',
        instrumental: 'detetom',
        locative: 'detetu',
      },
      plural: {
        nominative: 'deca',
        genitive: 'dece',
        dative: 'deci',
        accusative: 'decu',
        instrumental: 'decoma',
        locative: 'deci',
      },
    },
  },
  {
    word: 'sa',
    partOfSpeech: 'other',
    translation: {
      english: 'with',
      russian: 'с',
    },
  },
];

export const STRINGIFIED_EXAMPLE = JSON.stringify(EXAMPLE);
