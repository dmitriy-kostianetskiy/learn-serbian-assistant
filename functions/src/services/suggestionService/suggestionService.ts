import { Suggestions, SuggestionsSchema } from '../../model/suggestions';
import { substitutePlaceholders } from '../../utils/substitutePlaceholders';
import { ConfigService } from '../configService';
import { OpenAiService } from '../openAiService';

export interface SuggestionService {
  generate(phrase: string): Promise<Suggestions>;
}

export const getSuggestionService = ({
  configService,
  openAiService,
}: {
  configService: ConfigService;
  openAiService: OpenAiService;
}): SuggestionService => {
  return {
    async generate(phrase) {
      // get prompt
      const [
        suggestionsDeveloperPromptTemplate,
        suggestionsUserPromptTemplate,
      ] = await Promise.all([
        configService.get<string>('suggestionsSystemPrompt'),
        configService.get<string>('suggestionsUserPrompt'),
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
