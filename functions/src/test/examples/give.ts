import { Summary } from '../../model/summary';

export const GIVE_EXAMPLE: Summary = {
  input: 'dati',
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
  additionalInfo: {
    partOfSpeech: 'verb',
    infinitive: 'dati',
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
};
