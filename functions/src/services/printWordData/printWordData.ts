import {
  Cases,
  NounData,
  OtherData,
  VerbData,
  WordData,
} from '../../model/wordData';

export const printPhraseSummary = (phraseSummary: WordData): string => {
  switch (phraseSummary.partOfSpeech) {
    case 'verb':
      return printVerb(phraseSummary);
    case 'noun':
      return printNoun(phraseSummary);
    default:
      return printOther(phraseSummary);
  }
};

const printVerb = (verb: VerbData) => {
  const { conjugations, infinitive } = verb;

  return [
    `<strong>${infinitive}</strong>`,
    '',
    printBasicSummary(verb),
    '',
    '🔄 <strong>Conjugations</strong>',
    '',
    `  Ja <strong>${conjugations.singular.first}</strong>`,
    `  Ti <strong>${conjugations.singular.second}</strong>`,
    `  On\\Ona\\Ono <strong>${conjugations.singular.third}</strong>`,
    '',
    `  Mi <strong>${conjugations.plural.first}</strong>`,
    `  Vi <strong>${conjugations.plural.second}</strong>`,
    `  Oni\\One\\Ona <strong>${conjugations.plural.third}</strong>`,
  ].join('\n');
};

const printNoun = (noun: NounData) => {
  const { cases, word, grammaticalGender, grammaticalNumber } = noun;

  return [
    `📝 <strong>${word}</strong> (${grammaticalNumber}, ${grammaticalGender})`,
    '',
    printBasicSummary(noun),
    '',
    '🔄 <strong>Cases</strong>',
    '',
    '👤 Singular:',
    '',
    printCases(cases.singular),
    '',
    '👥 Plural:',
    '',
    printCases(cases.plural),
  ].join('\n');
};

const printOther = (other: OtherData) => {
  const { word } = other;

  return [`<strong>${word}</strong>`, '', printBasicSummary(other)].join('\n');
};

const printBasicSummary = ({
  definition,
  translation,
  synonyms,
  example,
}: WordData) => {
  return [
    `💡 Example: ${example}`,
    '',
    ...[
      '❗️ <strong>Definition</strong>',
      '',
      `  🇷🇸 ${definition.serbian}`,
      `  🇬🇧 ${definition.english}`,
      `  🇷🇺 ${definition.russian}`,
      '',
      '💬 <strong>Translation</strong>',
      '',
      `  🇬🇧 ${translation.english}`,
      `  🇷🇺 ${translation.russian}`,
    ],
    ...(synonyms.length > 0
      ? ['', '📚 <strong>Synonyms</strong>', '', synonyms.join(', ')]
      : []),
  ].join('\n');
};

const printCases = (cases: Cases) => {
  return [
    `  Nominative: <strong>${cases.nominative}</strong>`,
    `  Genitive: <strong>${cases.genitive}</strong>`,
    `  Dative: <strong>${cases.dative}</strong>`,
    `  Accusative: <strong>${cases.accusative}</strong>`,
    `  Instrumental: <strong>${cases.instrumental}</strong>`,
    `  Locative: <strong>${cases.locative}</strong>`,
    `  Vocative: <strong>${cases.vocative}</strong>`,
  ].join('\n');
};
