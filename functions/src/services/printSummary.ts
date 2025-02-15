import Handlebars from 'handlebars';
import {
  Summary,
  GrammaticalGender,
  GrammaticalNumber,
} from '../model/summary';

// Partials
Handlebars.registerPartial(
  'basicInfo',
  `💡 <strong>Primer</strong>
  {{example}}

{{#with definition}}
❗️ <strong>Definicija</strong>
  🇷🇸 {{serbian}}
  🇺🇸 {{english}}
  🇷🇺 {{russian}}
{{/with}}

{{#with translation}}
💬 <strong>Prevod</strong>
  🇺🇸 {{english}}
  🇷🇺 {{russian}}
{{/with}}

{{#if synonyms}}
📚 <strong>Sinonimi</strong>
  {{#each synonyms}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}`,
);

Handlebars.registerPartial(
  'casesInfo',
  `
{{#with additionalInfo.cases.singular}}
👤 Jednina:
  Nominative: <strong>{{nominative}}</strong>
  Genitive: <strong>{{genitive}}</strong>
  Dative: <strong>{{dative}}</strong>
  Akuzative: <strong>{{accusative}}</strong>
  Instrumental: <strong>{{instrumental}}</strong>
  Lokative: <strong>{{locative}}</strong>
  Vokative: <strong>{{vocative}}</strong>
{{/with}}

{{#with additionalInfo.cases.plural}}
👥 Množina:
  Nominative: <strong>{{nominative}}</strong>
  Genitive: <strong>{{genitive}}</strong>
  Dative: <strong>{{dative}}</strong>
  Akuzative: <strong>{{accusative}}</strong>
  Instrumental: <strong>{{instrumental}}</strong>
  Lokative: <strong>{{locative}}</strong>
  Vokative: <strong>{{vocative}}</strong>
{{/with}}`,
);

Handlebars.registerPartial(
  'conjugationsInfo',
  `{{#each additionalInfo.conjugations}}

  <strong>{{conjugationTitle @key}}</strong>

  Ja <strong>{{this.singular.first}}</strong>
  Ti <strong>{{this.singular.second}}</strong>
  On/Ona/Ono <strong>{{this.singular.third}}</strong>
  Mi <strong>{{this.plural.first}}</strong>
  Vi <strong>{{this.plural.second}}</strong>
  Oni/One/Ona <strong>{{this.plural.third}}</strong>
{{/each}}`,
);

// Helpers
Handlebars.registerHelper('grammaticalGender', (gender: GrammaticalGender) => {
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
});

Handlebars.registerHelper('grammaticalNumber', (number: GrammaticalNumber) => {
  switch (number) {
    case 'p':
      return 'množina';
    case 's':
      return 'jednina';
    default:
      return '';
  }
});

Handlebars.registerHelper('subtitle', (...params: unknown[]) => {
  const text = params
    .slice(0, -1)
    .filter((item) => item)
    .join(', ');

  if (!text) {
    return '';
  }

  return `(${text})`;
});

Handlebars.registerHelper('nounSubtitle', (gender: string, number: string) => {
  const text = [gender, number].filter((item) => item).join(', ');

  if (!text) {
    return '';
  }

  return `(${text})`;
});

Handlebars.registerHelper('conjugationTitle', (conjugationKey: string) => {
  switch (conjugationKey) {
    case 'present':
      return '⏰ Prezent';
    case 'perfect':
      return '↩️ Perfekat';
    case 'future':
      return '🔮 Futur I';
    default:
      console.warn(`Unknown conjugation key: ${conjugationKey}`);

      return conjugationKey;
  }
});

Handlebars.registerHelper(
  'partOfSpeech',
  (partOfSpeech: Summary['additionalInfo']['partOfSpeech']) => {
    switch (partOfSpeech) {
      case 'verb':
        return 'glagol';
      case 'noun':
        return 'imenica';
      case 'adjective':
        return 'pridev';
      default:
        return '';
    }
  },
);

// Templates
const nounTemplate = Handlebars.compile(
  `
📝 <strong>{{input}}</strong> {{{subtitle
  (partOfSpeech additionalInfo.partOfSpeech)
  (grammaticalGender additionalInfo.grammaticalGender)
  (grammaticalNumber additionalInfo.grammaticalNumber)
}}}

{{> basicInfo}}

🔄 <strong>Padeži</strong>
{{> casesInfo}}
`,
);

const verbTemplate = Handlebars.compile(
  `
📝 <strong>{{input}}</strong> {{{subtitle (partOfSpeech additionalInfo.partOfSpeech)}}}
<em>inf.</em> {{additionalInfo.infinitive}}

{{> basicInfo}}

🔄 <strong>Conjugacija</strong>
{{> conjugationsInfo}}
`,
);

const adjectiveTemplate = Handlebars.compile(
  `
📝 <strong>{{input}}</strong> {{{subtitle
  (partOfSpeech additionalInfo.partOfSpeech)
  (grammaticalGender additionalInfo.grammaticalGender)
  (grammaticalNumber additionalInfo.grammaticalNumber)
}}}

{{> basicInfo}}

🔄 <strong>Padeži</strong>
{{> casesInfo}}
`,
);

const otherTemplate = Handlebars.compile(
  `
📝 <strong>{{input}}</strong>

{{> basicInfo}}
`,
);

export function printSummary(summary: Summary): string {
  switch (summary.additionalInfo.partOfSpeech) {
    case 'verb':
      return verbTemplate(summary);
    case 'noun':
      return nounTemplate(summary);
    case 'adjective':
      return adjectiveTemplate(summary);
    default:
      return otherTemplate(summary);
  }
}
