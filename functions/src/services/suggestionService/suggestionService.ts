import { substitutePlaceholders } from '../../utils/substitutePlaceholders';
import {
  SuggestionService,
  SuggestionServiceDependencies,
} from './suggestionService.model';

type SuggestionPromptResponse = {
  language?: string;
  suggestions?: string[];
};

export const getSuggestionService = ({
  configService,
  openAiService,
}: SuggestionServiceDependencies): SuggestionService => {
  return {
    async generate(phrase) {
      // get prompt
      const suggestionsPromptTemplate =
        await configService.get('suggestionsPrompt');

      const suggestionsPrompt = substitutePlaceholders(
        suggestionsPromptTemplate,
        {
          phrase,
        },
      );

      // generate suggestions
      const result = await openAiService.promptAsJson<
        SuggestionPromptResponse | undefined
      >(suggestionsPrompt);

      return {
        language: result?.language || 'unknown',
        suggestions: result?.suggestions || [],
      };
    },
  };
};
