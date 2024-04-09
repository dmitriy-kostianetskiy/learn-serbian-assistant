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
      const [suggestionsSystemPromptTemplate, suggestionsUserPromptTemplate] =
        await Promise.all([
          configService.get('suggestionsSystemPrompt'),
          configService.get('suggestionsUserPrompt'),
        ]);

      const suggestionsSystemPrompt = substitutePlaceholders(
        suggestionsSystemPromptTemplate,
        {
          phrase,
        },
      );

      const suggestionsUserPrompt = substitutePlaceholders(
        suggestionsUserPromptTemplate,
        {
          phrase,
        },
      );

      // generate suggestions
      const result = await openAiService.promptAsJson<
        SuggestionPromptResponse | undefined
      >(suggestionsUserPrompt, suggestionsSystemPrompt);

      return {
        language: result?.language || 'unknown',
        suggestions: result?.suggestions || [],
      };
    },
  };
};
