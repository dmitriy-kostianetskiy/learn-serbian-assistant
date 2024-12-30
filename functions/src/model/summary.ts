import { z } from 'zod';

const ConjugationsByPersonSchema = z.object(
  {
    first: z.string({ description: 'First person' }),
    second: z.string({ description: 'Second person' }),
    third: z.string({ description: 'Third person' }),
  },
  { description: 'Conjugations of the verb' },
);

export type ConjugationsByPerson = z.infer<typeof ConjugationsByPersonSchema>;

const SimpleConjugations = z.object({
  singular: ConjugationsByPersonSchema,
  plural: ConjugationsByPersonSchema,
});

export type SimpleConjugations = z.infer<typeof SimpleConjugations>;

const Conjugations = z.object({
  present: SimpleConjugations,
  perfect: SimpleConjugations,
  future: SimpleConjugations,
});

export type Conjugations = z.infer<typeof Conjugations>;

const CasesSchema = z.object({
  nominative: z.string(),
  genitive: z.string(),
  dative: z.string(),
  accusative: z.string(),
  instrumental: z.string(),
  locative: z.string(),
  vocative: z.string(),
});

export type Cases = z.infer<typeof CasesSchema>;

const CasesByNumberSchema = z.object({
  singular: CasesSchema,
  plural: CasesSchema,
});

export type CasesByNumber = z.infer<typeof CasesByNumberSchema>;

const GrammaticalGenderSchema = z.enum(['m', 'f', 'n'], {
  description:
    'Grammatical gender if can be determined from the input otherwise null',
});

export type GrammaticalGender = z.infer<typeof GrammaticalGenderSchema>;

const GrammaticalNumberSchema = z.enum(['s', 'p'], {
  description:
    'Grammatical number if can be determined from the input otherwise null',
});

export type GrammaticalNumber = z.infer<typeof GrammaticalNumberSchema>;

const VerbAdditionalInfoSchema = z.object({
  partOfSpeech: z.literal('verb'),
  infinitive: z.string({
    description: 'Infinitive form of the verb',
  }),
  conjugations: Conjugations,
});

export type VerbAdditionalInfo = z.infer<typeof VerbAdditionalInfoSchema>;

const NounAdditionalInfoSchema = z.object({
  partOfSpeech: z.literal('noun'),
  grammaticalGender: GrammaticalGenderSchema,
  grammaticalNumber: GrammaticalNumberSchema,
  cases: CasesByNumberSchema,
});

export type NounAdditionalInfo = z.infer<typeof NounAdditionalInfoSchema>;

const OtherAdditionalInfoSchema = z.object({
  partOfSpeech: z.literal('other'),
});

export type OtherAdditionalInfo = z.infer<typeof OtherAdditionalInfoSchema>;

export const SummarySchema = z.object({
  input: z.string({
    description: 'Input text to process',
  }),
  translation: z.object({
    english: z.string({
      description: 'English translation of the input',
    }),
    russian: z.string({
      description: 'Russian translation of the input',
    }),
  }),
  definition: z.object({
    english: z.string({
      description: 'English definition of the input',
    }),
    russian: z.string({
      description: 'Russian definition of the input',
    }),
    serbian: z.string({
      description: 'Serbian definition of the input',
    }),
  }),
  example: z.string({
    description: 'Example of the input in a sentence',
  }),
  synonyms: z.array(z.string(), {
    description: 'Synonyms of the input',
  }),
  additionalInfo: z.discriminatedUnion(
    'partOfSpeech',
    [
      VerbAdditionalInfoSchema,
      NounAdditionalInfoSchema,
      OtherAdditionalInfoSchema,
    ],
    {
      description: 'Additional information about the input',
    },
  ),
});

export type Summary = z.infer<typeof SummarySchema>;
