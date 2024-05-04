import {
  Cases,
  Conjugations,
  NounSummary,
  PhraseSummary,
  PhraseSummaryBase,
  VerbSummary,
} from '../../model/phraseSummary';

type Validators = Exclude<keyof PhraseSummaryValidator, 'build'>;

export type ValidatePhraseSummaryError = {
  error: string;
  path: string;
  validator: Validators;
};

type ValidatePhraseSummaryResult = {
  passed: boolean;
  errors: ValidatePhraseSummaryError[];
};

type PhraseSummaryValidator = {
  isDefined(value: unknown, path: string): boolean;
  build(): ValidatePhraseSummaryResult;
};

const createValidator = (): PhraseSummaryValidator => {
  const result: ValidatePhraseSummaryResult = {
    errors: [],
    passed: true,
  };

  return {
    isDefined(value: unknown, path: string): boolean {
      if (value === null || value === undefined) {
        result.errors.push({
          path,
          error: `"${path}" has value null or undefined`,
          validator: 'isDefined',
        });
        result.passed = false;

        return false;
      }

      return true;
    },
    build(): ValidatePhraseSummaryResult {
      return result;
    },
  };
};

export const validatePhraseSummary = (
  summary: PhraseSummary,
): ValidatePhraseSummaryResult => {
  const validator = createValidator();

  validatePhraseSummaryBase(validator, summary);

  switch (summary.partOfSpeech) {
    case 'verb':
      validateVerbSummary(validator, summary);
      break;
    case 'noun':
      validateNounSummary(validator, summary);
      break;
    case 'other':
      break;
  }

  return validator.build();
};

const validatePhraseSummaryBase = (
  validator: PhraseSummaryValidator,
  summary: PhraseSummaryBase,
) => {
  validator.isDefined(summary.partOfSpeech, 'partOfSpeech');

  validator.isDefined(summary.definition?.serbian, 'definition.serbian');
  validator.isDefined(summary.definition?.english, 'definition.english');
  validator.isDefined(summary.definition?.russian, 'definition.russian');

  validator.isDefined(summary.translation?.english, 'translation.english');
  validator.isDefined(summary.translation?.russian, 'translation.russian');

  validator.isDefined(summary.synonyms, 'synonyms');

  validator.isDefined(summary.example, 'example');
};

const validateNounSummary = (
  validator: PhraseSummaryValidator,
  summary: NounSummary,
) => {
  validator.isDefined(summary.grammaticalGender, 'grammaticalGender');
  validator.isDefined(summary.grammaticalNumber, 'grammaticalNumber');

  validateCases(validator, summary.cases?.singular, 'cases.singular');
  validateCases(validator, summary.cases?.plural, 'cases.plural');
};

const validateVerbSummary = (
  validator: PhraseSummaryValidator,
  summary: VerbSummary,
) => {
  validator.isDefined(summary.infinitive, 'infinitive');

  validateConjugations(
    validator,
    summary.conjugations?.plural,
    'conjugations.plural',
  );

  validateConjugations(
    validator,
    summary.conjugations?.singular,
    'conjugations.singular',
  );
};

const validateConjugations = (
  validator: PhraseSummaryValidator,
  conjugations: Conjugations | null | undefined,
  path: string,
) => {
  validator.isDefined(conjugations?.first, `${path}.first`);
  validator.isDefined(conjugations?.second, `${path}.second`);
  validator.isDefined(conjugations?.third, `${path}.third`);
};

const validateCases = (
  validator: PhraseSummaryValidator,
  conjugations: Cases | null | undefined,
  path: string,
) => {
  validator.isDefined(conjugations?.nominative, `${path}.nominative`);
  validator.isDefined(conjugations?.genitive, `${path}.genitive`);
  validator.isDefined(conjugations?.dative, `${path}.dative`);
  validator.isDefined(conjugations?.accusative, `${path}.accusative`);
  validator.isDefined(conjugations?.instrumental, `${path}.instrumental`);
  validator.isDefined(conjugations?.locative, `${path}.locative`);
  validator.isDefined(conjugations?.vocative, `${path}.vocative`);
};
