import { GeneratePhraseSummaryPayload } from './generatePhraseSummaryPayload';
import { PhraseSummary } from './phraseSummary';
import { Suggestions } from './suggestions';

export type SummaryRequestEvent = {
  type: 'summary-request';
  payload: GeneratePhraseSummaryPayload;
};

export type DailyQuotaExceededEvent = {
  type: 'daily-quota-exceeded';
  payload: GeneratePhraseSummaryPayload;
};

export type PhraseIsNotSerbianEvent = {
  type: 'phrase-is-not-serbian';
  payload: GeneratePhraseSummaryPayload;
  suggestions: Suggestions;
};

export type PhraseIsUnknownEvent = {
  type: 'phrase-is-unknown';
  payload: GeneratePhraseSummaryPayload;
};

export type PhraseSummaryGenerateEvent = {
  type: 'phrase-summary-generated';
  payload: GeneratePhraseSummaryPayload;
  phraseSummary: PhraseSummary;
};

export type ChargedEvent = {
  type: 'charged';
  payload: GeneratePhraseSummaryPayload;
};


export type AssistantEvent = SummaryRequestEvent
  | DailyQuotaExceededEvent
  | PhraseIsNotSerbianEvent
  | PhraseIsUnknownEvent
  | PhraseSummaryGenerateEvent
  | ChargedEvent;
