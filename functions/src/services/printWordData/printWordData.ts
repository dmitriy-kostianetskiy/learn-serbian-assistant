import {
  Cases,
  NounSummary,
  OtherSummary,
  VerbSummary,
  PhraseSummary,
  CasesOutput,
  ConjugationsOutput,
} from '../../model/phraseSummary';

export const printPhraseSummary = (phraseSummary: PhraseSummary): string => {
  switch (phraseSummary.partOfSpeech) {
    case 'verb':
      return printVerb(phraseSummary);
    case 'noun':
      return printNounSummary(phraseSummary);
    default:
      return printOtherSummary(phraseSummary);
  }
};

const printVerb = (verbSummary: VerbSummary) => {
  const { phrase } = verbSummary;

  return [
    `<strong>${phrase}</strong>`,
    '',
    printBasicSummary(verbSummary),
    printConjugationsOutput(verbSummary?.conjugations),
  ].join('\n');
};

const printConjugationsOutput = (conjugations?: ConjugationsOutput): string => {
  return [
    '',
    '🔄 <strong>Conjugations</strong>',
    '',
    `  Ja <strong>${printNullish(conjugations?.singular?.first)}</strong>`,
    `  Ti <strong>${printNullish(conjugations?.singular?.second)}</strong>`,
    `  On/Ona/Ono <strong>${printNullish(conjugations?.singular?.third)}</strong>`,
    '',
    `  Mi <strong>${printNullish(conjugations?.plural?.first)}</strong>`,
    `  Vi <strong>${printNullish(conjugations?.plural?.second)}</strong>`,
    `  Oni/One/Ona <strong>${printNullish(conjugations?.plural?.third)}</strong>`,
  ].join('\n');
};

const printNounSummary = (nounSummary: NounSummary) => {
  const { cases, phrase } = nounSummary;

  return [
    `📝 <strong>${phrase}</strong> ${printNumberAndGender(nounSummary)}`,
    '',
    printBasicSummary(nounSummary),
    printCasesOutput(cases),
  ].join('\n');
};

const printNumberAndGender = ({
  grammaticalGender,
  grammaticalNumber,
}: NounSummary): string => {
  if (!grammaticalNumber && !grammaticalGender) {
    return '';
  }

  const text = [grammaticalGender, grammaticalNumber].join(', ');

  return `(${text})`;
};

const printOtherSummary = (other: OtherSummary) => {
  const { phrase } = other;

  return [`<strong>${phrase}</strong>`, '', printBasicSummary(other)].join(
    '\n',
  );
};

const printBasicSummary = ({
  definition,
  translation,
  synonyms,
  example,
}: PhraseSummary) => {
  return [
    `💡 Example: ${printNullish(example)}`,
    '',
    ...[
      '❗️ <strong>Definition</strong>',
      '',
      `  🇷🇸 ${printNullish(definition?.serbian)}`,
      `  🇺🇸 ${printNullish(definition?.english)}`,
      `  🇷🇺 ${printNullish(definition?.russian)}`,
      '',
      '💬 <strong>Translation</strong>',
      '',
      `  🇺🇸 ${printNullish(translation?.english)}`,
      `  🇷🇺 ${printNullish(translation?.russian)}`,
    ],
    ...(synonyms?.length
      ? ['', '📚 <strong>Synonyms</strong>', '', synonyms.join(', ')]
      : []),
  ].join('\n');
};

const printCasesOutput = (casesOutput?: CasesOutput) => {
  if (!casesOutput) {
    return '';
  }

  const { singular, plural } = casesOutput;

  return [
    '',
    '🔄 <strong>Cases</strong>',
    printCases('👤 Singular:', singular),
    printCases('👥 Plural:', plural),
  ].join('\n');
};

const printCases = (title: string, cases?: Cases) => {
  return [
    '',
    title,
    '',
    `  Nominative: <strong>${printNullish(cases?.nominative)}</strong>`,
    `  Genitive: <strong>${printNullish(cases?.genitive)}</strong>`,
    `  Dative: <strong>${printNullish(cases?.dative)}</strong>`,
    `  Accusative: <strong>${printNullish(cases?.accusative)}</strong>`,
    `  Instrumental: <strong>${printNullish(cases?.instrumental)}</strong>`,
    `  Locative: <strong>${printNullish(cases?.locative)}</strong>`,
    `  Vocative: <strong>${printNullish(cases?.vocative)}</strong>`,
  ].join('\n');
};

const printNullish = (value: string | number | null | undefined): string => {
  return value === null || typeof value === 'undefined' ? 'N/A' : `${value}`;
};
