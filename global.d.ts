type EnvVars = 'OPEN_AI_TOKEN';
type ProcessEnvVars = Partial<Record<EnvVars, string>>;

declare namespace NodeJS {
  declare type ProcessEnv = ProcessEnvVars;
}
