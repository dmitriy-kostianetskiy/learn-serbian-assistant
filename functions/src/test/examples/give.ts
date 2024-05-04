import { VerbSummary } from '../../model/phraseSummary';

export const GIVE_EXAMPLE: VerbSummary = {
  phrase: 'dati',
  infinitive: 'dati',
  partOfSpeech: 'verb',
  definition: {
    serbian: 'pružiti nešto',
    english: 'to move, shift, provide something',
    russian: 'перемещать что-либо',
  },
  translation: {
    english: 'to give',
    russian: 'давать',
  },
  synonyms: ['prineti', 'pružiti', 'darovati', 'pokloniti'],
  example: 'Molim dajte kafu!',
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
};
