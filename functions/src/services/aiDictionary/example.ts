import { WordData } from './model';

export const EXAMPLE: WordData[] = [
  {
    word: 'dati',
    partOfSpeech: 'verb',
    translation: {
      english: 'to give',
      russian: 'давать',
    },
    definition: {
      english:
        'To move, shift, provide something abstract or concrete to someone or something or somewhere.',
      russian: 'перемещать что-либо в распоряжение другого субъекта',
      serbian: 'pružiti nešto',
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
    definition: {
      english:
        'A person who has not yet reached adulthood, whether natural (puberty), cultural (initiation), or legal (majority).',
      russian: 'мальчик или девочка в раннем возрасте (до отрочества)',
      serbian: 'људско биће у односу на своје родитеље',
    },
    cases: {
      singular: {
        nominative: 'dete',
        genitive: 'deteta',
        dative: 'detetu',
        accusative: 'dete',
        instrumental: 'detetom',
        locative: 'detetu',
        vocative: 'dete',
      },
      plural: {
        nominative: 'deca',
        genitive: 'dece',
        dative: 'deci',
        accusative: 'decu',
        instrumental: 'decoma',
        locative: 'deci',
        vocative: 'deco',
      },
    },
  },
  {
    word: 'bre',
    partOfSpeech: 'other',
    translation: {
      english: 'hey',
      russian: 'эй!',
    },
    definition: {
      english: 'an exclamation used to call out to someone, to address someone',
      russian:
        'возглас, которым окликают, подзывают кого-либо, обращаются к кому-либо',
      serbian: 'Za pojačavanje pri obraćanju.',
    },
  },
];

export const STRINGIFIED_EXAMPLE = JSON.stringify(EXAMPLE);
