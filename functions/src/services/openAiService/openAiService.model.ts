import { z } from 'zod';

export type PromptOptions<T> = {
  userPrompt: string;
  developerPrompt?: string;
  structuredOutput: {
    schema: z.Schema<T>;
    schemaName: string;
  };
};

export interface OpenAiService {
  promptAsJson<T>(options: PromptOptions<T>): Promise<T>;
}
