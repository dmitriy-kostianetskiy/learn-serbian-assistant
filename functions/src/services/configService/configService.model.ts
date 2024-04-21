export type WellKnownParameter =
  | 'suggestionsSystemPrompt'
  | 'suggestionsUserPrompt'
  | 'phraseSummarySystemPrompt'
  | 'phraseSummaryUserPrompt'
  | 'dailyQuota';

export type GetResult<T extends WellKnownParameter = WellKnownParameter> =
  T extends
    | 'suggestionsSystemPrompt'
    | 'suggestionsUserPrompt'
    | 'phraseSummaryUserPrompt'
    | 'phraseSummarySystemPrompt'
    ? string
    : T extends 'dailyQuota'
      ? number
      : never;

export interface ConfigService {
  get<T extends WellKnownParameter = WellKnownParameter>(
    parameter: T,
  ): Promise<GetResult<T>>;
}
