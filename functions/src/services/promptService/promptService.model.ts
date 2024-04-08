export type GetPromptInputs = {
  word: string;
  example: string;
};

export type GetPromptResult = {
  promptTemplate: string;
  prompt: string;
  promptHash: string;
};

export interface PromptService {
  get(inputs: GetPromptInputs): Promise<GetPromptResult>;
}
