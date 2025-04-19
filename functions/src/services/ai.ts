import { z } from 'zod';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set

export type GenerateObjectOptions<T> = {
  prompt: string;
  system: string;
  schema: z.Schema<T>;
};

export type CreateAiOptions = {
  apiKey: string;
  seed?: number;
  temperature?: number;
};
export interface Ai {
  generateObject<T>(options: GenerateObjectOptions<T>): Promise<T>;
}

export const createAi = ({
  apiKey,
  seed = 42,
  temperature = 1,
}: CreateAiOptions): Ai => {
  const model = createOpenAI({
    apiKey,
  }).responses('gpt-4o');

  const service: Ai = {
    async generateObject<T>({
      system,
      prompt,
      schema,
    }: GenerateObjectOptions<T>) {
      const { object } = await generateObject<T>({
        model,
        system,
        prompt,
        schema,
        temperature,
        seed,
      });

      return object;
    },
  };

  return service;
};
