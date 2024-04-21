type PhraseSummaryBase = {
  phrase: string;
  partOfSpeech: PartOfSpeech;
  grammaticalGender?: string;
  grammaticalNumber?: string;
  translation?: Translation;
  definition?: Definition;
  example?: string;
  synonyms?: string[];
  promptHash?: string;
};

export type Translation = Partial<{
  english: string;
  russian: string;
}>;

export type Definition = Partial<{
  english: string;
  russian: string;
  serbian: string;
}>;

export type PartOfSpeech = 'verb' | 'noun' | 'other';

export type VerbSummary = PhraseSummaryBase & {
  partOfSpeech: 'verb';

  infinitive?: string;
  conjugations?: ConjugationsOutput;
};

export type ConjugationsOutput = Partial<{
  singular: Conjugations;
  plural: Conjugations;
}>;

export type Conjugations = Partial<{
  first: string;
  second: string;
  third: string;
}>;

export type NounSummary = PhraseSummaryBase & {
  partOfSpeech: 'noun';
  cases?: CasesOutput;
};

export type Cases = Partial<{
  nominative: string;
  genitive: string;
  dative: string;
  accusative: string;
  instrumental: string;
  locative: string;
  vocative: string;
}>;

export type CasesOutput = Partial<{
  singular: Cases;
  plural: Cases;
}>;

export type OtherSummary = PhraseSummaryBase & {
  partOfSpeech: 'other';
};

export type PhraseSummary = VerbSummary | NounSummary | OtherSummary;
