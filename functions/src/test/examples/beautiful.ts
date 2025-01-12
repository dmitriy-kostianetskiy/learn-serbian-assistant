import { Summary } from '../../model/summary';

export const BEAUTIFUL_EXAMPLE: Summary = {
  input: 'lep',
  definition: {
    english:
      'Having qualities that delight the senses; aesthetically pleasing.',
    russian: 'Имеющий качества, которые радуют чувства; эстетически приятный.',
    serbian: 'Imajući osobine koje obraduju čula; estetski prijatan.',
  },
  translation: {
    english: 'beautiful',
    russian: 'красивый',
  },
  synonyms: ['divan', 'predivan', 'lepši'],
  example: 'Dan je lep i sunčan.',
  additionalInfo: {
    partOfSpeech: 'adjective',
    grammaticalGender: 'm',
    grammaticalNumber: 's',
    cases: {
      singular: {
        nominative: 'lep',
        genitive: 'lepog',
        dative: 'lepom',
        accusative: 'lepog',
        instrumental: 'lepim',
        locative: 'lepom',
        vocative: 'lepi',
      },
      plural: {
        nominative: 'lepi',
        genitive: 'lepih',
        dative: 'lepim',
        accusative: 'lepe',
        instrumental: 'lepim',
        locative: 'lepim',
        vocative: 'lepi',
      },
    },
  },
};
