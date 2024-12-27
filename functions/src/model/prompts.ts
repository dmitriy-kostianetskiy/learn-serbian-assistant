type PromptType = 'user' | 'developer' | 'assistant';

export type PromptNames = Record<`${PromptType}PromptName`, string>;
export type Prompts = Record<`${PromptType}Prompt`, string>;
