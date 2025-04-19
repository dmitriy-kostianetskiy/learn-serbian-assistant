import { GenerateSummaryPayload } from './generateSummaryPayload';
import { Summary } from './summary';

export type SummaryRequestEvent = {
  type: 'summary-request';
  payload: GenerateSummaryPayload;
};

export type DailyQuotaExceededEvent = {
  type: 'daily-quota-exceeded';
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
  | GenerateSummaryEvent
  | ChargedEvent;
