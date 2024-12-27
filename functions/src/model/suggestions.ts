import { z } from 'zod';

export const SuggestionsSchema = z.object({
  language: z.string({
    description:
      'Language of the original phrase or "unknown" if not recognized',
  }),
  suggestions: z.array(z.string(), {
    description:
      'List of equivalent phrases in the Serbian or empty list if the phrase is already in Serbian',
  }),
});

export type Suggestions = z.infer<typeof SuggestionsSchema>;
