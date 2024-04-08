export type WellKnownParameter =
  | 'wordDataPrompt'
  | 'welcomeMessage'
  | 'dailyQuota';

export type GetResult<T extends WellKnownParameter = WellKnownParameter> =
  T extends 'wordDataPrompt'
    ? string
    : T extends 'welcomeMessage'
      ? string
      : T extends 'dailyQuota'
        ? number
        : never;

export interface ConfigService {
  get<T extends WellKnownParameter = WellKnownParameter>(
    parameter: T,
  ): Promise<GetResult<T>>;
}
