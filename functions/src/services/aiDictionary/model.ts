interface WordDataBase {
  word: string;
  partOfSpeech: PartOfSpeech;
  translation: Translation;
  definition: Definition;
  synonyms: string[];
}

export interface Translation {
  english: string;
  russian: string;
}

export interface Definition {
  english: string;
  russian: string;
  serbian: string;
}

export type PartOfSpeech = 'verb' | 'noun' | 'other';

export interface VerbData extends WordDataBase {
  word: string;
  infinitive: string;
  partOfSpeech: 'verb';
  conjugations: ConjugationsOutput;
}

export interface ConjugationsOutput {
  singular: Conjugations;
  plural: Conjugations;
}

export interface Conjugations {
  first: string;
  second: string;
  third: string;
}

export interface NounData extends WordDataBase {
  partOfSpeech: 'noun';
  cases: CasesOutput;
}

export interface Cases {
  nominative: string;
  genitive: string;
  dative: string;
  accusative: string;
  instrumental: string;
  locative: string;
  vocative: string;
}

export interface CasesOutput {
  singular: Cases;
  plural: Cases;
}

export interface OtherData extends WordDataBase {
  partOfSpeech: 'other';
}

export type WordData = VerbData | NounData | OtherData;
