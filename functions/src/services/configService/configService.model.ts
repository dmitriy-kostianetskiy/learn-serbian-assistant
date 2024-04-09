export type WellKnownParameter =
  | 'suggestionsPrompt'
  | 'phraseSummaryPrompt'
  | 'welcomeMessage'
  | 'dailyQuota';

export type GetResult<T extends WellKnownParameter = WellKnownParameter> =
  T extends 'suggestionsPrompt' | 'welcomeMessage' | 'phraseSummaryPrompt'
    ? string
    : T extends 'dailyQuota'
      ? number
      : never;

export interface ConfigService {
  get<T extends WellKnownParameter = WellKnownParameter>(
    parameter: T,
  ): Promise<GetResult<T>>;
}
