import { GenerateSummaryPayload } from './generateSummaryPayload';
import { Summary } from './summary';
import { Suggestions } from './suggestions';

export type SummaryRequestEvent = {
  type: 'summary-request';
  payload: GenerateSummaryPayload;
};

export type DailyQuotaExceededEvent = {
  type: 'daily-quota-exceeded';
  payload: GenerateSummaryPayload;
};

export type PhraseIsNotSerbianEvent = {
  type: 'phrase-is-not-serbian';
  payload: GenerateSummaryPayload;
  suggestions: Suggestions;
};

export type PhraseIsUnknownEvent = {
  type: 'phrase-is-unknown';
  payload: GenerateSummaryPayload;
};

export type GenerateSummaryEvent = {
  type: 'summary-generated';
  payload: GenerateSummaryPayload;
  summary: Summary;
  takenFromCache: boolean;
};

export type ChargedEvent = {
  type: 'charged';
  payload: GenerateSummaryPayload;
};

export type AssistantEvent =
  | SummaryRequestEvent
  | DailyQuotaExceededEvent
  | PhraseIsNotSerbianEvent
  | PhraseIsUnknownEvent
  | GenerateSummaryEvent
  | ChargedEvent;
