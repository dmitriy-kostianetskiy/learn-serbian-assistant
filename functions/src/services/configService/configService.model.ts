export type WellKnownParameter =
  | 'suggestionsPrompt'
  | 'phraseSummarySystemPrompt'
  | 'phraseSummaryUserPrompt'
  | 'welcomeMessage'
  | 'dailyQuota';

export type GetResult<T extends WellKnownParameter = WellKnownParameter> =
  T extends
    | 'suggestionsPrompt'
    | 'welcomeMessage'
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
