import {
  Cases,
  Summary,
  ConjugationsByNumber,
  CasesByNumber,
  GrammaticalGender,
  GrammaticalNumber,
} from '../../model/summary';

export const printSummary = (summary: Summary): string => {
  return [
    printTitle(summary),
    printBasicInfo(summary),
    printAdditionalInfo(summary),
  ].join('\n');
};

const printTitle = (summary: Summary) => {
  const subtitle = printSubtitle(summary);

  return [
    `📝 <strong>${summary.input}</strong>${subtitle ? ` ${subtitle}` : ''}`,
    '',
  ].join('\n');
};

const printSubtitle = (summary: Summary): string | null => {
  return printInfinitive(summary) || printNumberAndGender(summary) || '';
};

const printNumberAndGender = ({ additionalInfo }: Summary) => {
  if (additionalInfo.partOfSpeech !== 'noun') {
    return '';
  }

  const { grammaticalNumber, grammaticalGender } = additionalInfo;

  if (!grammaticalNumber && !grammaticalGender) {
    return '';
  }

  const text = [
    printGrammaticalGender(grammaticalGender),
    printGrammaticalNumber(grammaticalNumber),
  ]
    .filter((item) => item)
    .join(', ');

  return `(${text})`;
};

const printGrammaticalGender = (gender: GrammaticalGender): string => {
  switch (gender) {
    case 'm':
      return 'muški';
    case 'f':
      return 'ženski';
    case 'n':
      return 'srednji';
    default:
      return '';
  }
};

const printGrammaticalNumber = (
  grammaticalNumber: GrammaticalNumber,
): string => {
  switch (grammaticalNumber) {
    case 'p':
      return 'množina';
    case 's':
      return 'jednina';
    default:
      return '';
  }
};

const printInfinitive = ({ additionalInfo }: Summary) => {
  if (additionalInfo.partOfSpeech !== 'verb') {
    return '';
  }

  const { infinitive } = additionalInfo;

  if (!infinitive) {
    return '';
  }

  return `(<em>inf.</em> ${infinitive})`;
};

const printBasicInfo = ({
  definition,
  translation,
  synonyms,
  example,
}: Summary) => {
  return [
    `💡 Primer: ${printNullish(example)}`,
    '',
    ...[
      '❗️ <strong>Definicija</strong>',
      '',
      `  🇷🇸 ${printNullish(definition?.serbian)}`,
      `  🇺🇸 ${printNullish(definition?.english)}`,
      `  🇷🇺 ${printNullish(definition?.russian)}`,
      '',
      '💬 <strong>Prevod</strong>',
      '',
      `  🇺🇸 ${printNullish(translation?.english)}`,
      `  🇷🇺 ${printNullish(translation?.russian)}`,
    ],
    ...(synonyms?.length
      ? ['', '📚 <strong>Sinonimi</strong>', '', synonyms.join(', ')]
      : []),
  ].join('\n');
};

const printAdditionalInfo = (summary: Summary): string => {
  return (
    printVerbAdditionalInfo(summary) || printNounAdditionalInfo(summary) || ''
  );
};

const printVerbAdditionalInfo = ({ additionalInfo }: Summary) => {
  if (additionalInfo.partOfSpeech !== 'verb') {
    return '';
  }

  return printConjugationsByNumber(additionalInfo.conjugations);
};

const printNounAdditionalInfo = ({ additionalInfo }: Summary) => {
  if (additionalInfo.partOfSpeech !== 'noun') {
    return '';
  }

  return printCasesByNumber(additionalInfo.cases);
};

const printConjugationsByNumber = (
  conjugations: ConjugationsByNumber,
): string => {
  return [
    '',
    '🔄 <strong>Conjugacija</strong>',
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

const printCasesByNumber = (cases: CasesByNumber) => {
  const { singular, plural } = cases;

  return [
    '',
    '🔄 <strong>Padeži</strong>',
    printCases('👤 Jednina:', singular),
    printCases('👥 Množina:', plural),
  ].join('\n');
};

const printCases = (title: string, cases: Cases) => {
  return [
    '',
    title,
    '',
    `  Nominative: <strong>${printNullish(cases?.nominative)}</strong>`,
    `  Genitive: <strong>${printNullish(cases?.genitive)}</strong>`,
    `  Dative: <strong>${printNullish(cases?.dative)}</strong>`,
    `  Akuzative: <strong>${printNullish(cases?.accusative)}</strong>`,
    `  Instrumental: <strong>${printNullish(cases?.instrumental)}</strong>`,
    `  Lokative: <strong>${printNullish(cases?.locative)}</strong>`,
    `  Vokative: <strong>${printNullish(cases?.vocative)}</strong>`,
  ].join('\n');
};

const printNullish = (value: string | number | null | undefined): string => {
  return value === null || typeof value === 'undefined' ? 'N/A' : `${value}`;
};
