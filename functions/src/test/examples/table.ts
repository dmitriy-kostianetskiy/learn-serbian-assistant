import { Summary } from '../../model/summary';

export const TABLE_EXAMPLE: Summary = {
  input: 'sto',
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
  additionalInfo: {
    partOfSpeech: 'noun',
    grammaticalGender: 'n',
    grammaticalNumber: 's',
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
  },
};
