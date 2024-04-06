export type WellKnownParameter = 'wordDataPrompt' | 'welcomeMessage';

export interface ConfigService {
  get(parameter: WellKnownParameter): Promise<string>;
}
