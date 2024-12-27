import { Dependencies } from '../dependencies';
import { PromptNames } from '../model/prompts';
import { Suggestions, SuggestionsSchema } from '../model/suggestions';

export interface SuggestionService {
  generate(phrase: string): Promise<Suggestions>;
}

export type SuggestionsServiceDependencies = Pick<
  Dependencies,
  'openAiService' | 'promptBuilderService'
> &
  PromptNames;

export const getSuggestionService = ({
  openAiService,
  promptBuilderService,
  ...promptNames
}: SuggestionsServiceDependencies): SuggestionService => {
  return {
    async generate(phrase) {
      // get prompts
      const prompts = await promptBuilderService.buildPrompt(promptNames, {
        phrase,
      });

      // generate suggestions
      const result = await openAiService.promptAsJson({
        prompts,
        structuredOutput: {
          schema: SuggestionsSchema,
          schemaName: 'suggestions',
        },
      });

      return result;
    },
  };
};
