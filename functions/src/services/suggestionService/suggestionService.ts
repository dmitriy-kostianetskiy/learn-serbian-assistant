import { Dependencies } from '../../dependencies';
import { Suggestions, SuggestionsSchema } from '../../model/suggestions';
import { substitutePlaceholders } from '../../utils/substitutePlaceholders';

export interface SuggestionService {
  generate(phrase: string): Promise<Suggestions>;
}

export type SuggestionsServiceDependencies = Pick<
  Dependencies,
  'configService' | 'openAiService'
> & {
  suggestionsUserPromptName?: string;
  suggestionsDeveloperPromptName?: string;
};

export const getSuggestionService = ({
  configService,
  openAiService,
  suggestionsUserPromptName,
  suggestionsDeveloperPromptName,
}: SuggestionsServiceDependencies): SuggestionService => {
  return {
    async generate(phrase) {
      // get prompt
      const [
        suggestionsDeveloperPromptTemplate,
        suggestionsUserPromptTemplate,
      ] = await Promise.all([
        configService.get<string>(
          suggestionsDeveloperPromptName || 'suggestionsDeveloperPrompt',
        ),
        configService.get<string>(
          suggestionsUserPromptName || 'suggestionsUserPrompt',
        ),
      ]);

      const developerPrompt = substitutePlaceholders(
        suggestionsDeveloperPromptTemplate,
        {
          phrase,
        },
      );

      const userPrompt = substitutePlaceholders(suggestionsUserPromptTemplate, {
        phrase,
      });

      // generate suggestions
      const result = await openAiService.promptAsJson({
        userPrompt,
        developerPrompt,
        structuredOutput: {
          schema: SuggestionsSchema,
          schemaName: 'suggestions',
        },
      });

      return result;
    },
  };
};
