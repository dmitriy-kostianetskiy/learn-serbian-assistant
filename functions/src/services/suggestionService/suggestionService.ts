import { Suggestions } from '../../model/suggestions';
import { substitutePlaceholders } from '../../utils/substitutePlaceholders';
import { ConfigService } from '../configService';
import { OpenAiService } from '../openAiService';

export interface SuggestionService {
  generate(phrase: string): Promise<Suggestions>;
}

type SuggestionPromptResponse = {
  language?: string;
  suggestions?: string[];
};

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
