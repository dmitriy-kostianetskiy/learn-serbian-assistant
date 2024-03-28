interface AssistantOutputBase {
  word: string;
  partOfSpeech: PartOfSpeech;
  translation: Translation;
}

export interface Translation {
  english: string;
  russian: string;
}

export type PartOfSpeech = 'verb' | 'noun' | 'other';

export interface AssistantVerbOutput extends AssistantOutputBase {
  word: string;
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

export interface AssistantNounOutput extends AssistantOutputBase {
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
}

export interface CasesOutput {
  singular: Cases;
  plural: Cases;
}

export interface AssistantOtherOutput extends AssistantOutputBase {
  partOfSpeech: 'other';
}

export type AssistantOutput =
  | AssistantVerbOutput
  | AssistantNounOutput
  | AssistantOtherOutput;
