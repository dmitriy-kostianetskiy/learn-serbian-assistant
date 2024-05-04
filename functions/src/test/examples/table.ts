import { NounSummary } from '../../model/phraseSummary';

export const TABLE_EXAMPLE: NounSummary = {
  phrase: 'sto',
  partOfSpeech: 'noun',
  grammaticalGender: 'srednji',
  grammaticalNumber: 'jednina',
  definition: {
    english: 'a piece of furniture',
    russian: 'предмет мебели',
    serbian: 'komad nameštaja',
  },
  translation: {
    english: 'table',
    russian: 'стол',
  },
  synonyms: ['astal', 'trpeza'],
  example: 'Ostavite to na stolu.',
  cases: {
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
  },
};
