import {
  Cases,
  NounData,
  OtherData,
  VerbData,
  WordData,
} from '../aiDictionary/model';

export const printWordData = (wordData: WordData): string => {
  switch (wordData.partOfSpeech) {
    case 'verb':
      return printVerb(wordData);
    case 'noun':
      return printNoun(wordData);
    default:
      return printOther(wordData);
  }
};
const printVerb = (wordData: VerbData) => {
  const { conjugations, infinitive } = wordData;

  return [
    `<strong>${infinitive}</strong>`,
    '',
    printBasicWordData(wordData),
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
const printNoun = (wordData: NounData) => {
  const { cases } = wordData;

  return [
    `<strong>${cases.singular.nominative}</strong>`,
    '',
    printBasicWordData(wordData),
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
const printOther = (wordData: OtherData) => {
  const { word } = wordData;

  return [`<strong>${word}</strong>`, '', printBasicWordData(wordData)].join(
    '\n',
  );
};
const printBasicWordData = ({
  definition,
  translation,
  synonyms,
}: WordData) => {
  return [
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
