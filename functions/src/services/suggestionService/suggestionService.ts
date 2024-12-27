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
  userPromptName?: string;
  developerPromptName?: string;
  assistantPromptName?: string;
};

export const getSuggestionService = ({
  configService,
  openAiService,
  userPromptName: userPromptName,
  developerPromptName: developerPromptName,
  assistantPromptName,
}: SuggestionsServiceDependencies): SuggestionService => {
  return {
    async generate(phrase) {
      // get prompt
      const [
        developerPromptTemplate,
        userPromptTemplate,
        assistantPromptTemplate,
      ] = await Promise.all([
        configService.get<string>(
          developerPromptName || 'suggestionsDeveloperPrompt',
        ),
        configService.get<string>(userPromptName || 'suggestionsUserPrompt'),
        configService.get<string>(
          assistantPromptName || 'suggestionsAssistantPrompt',
        ),
      ]);

      const developerPrompt = substitutePlaceholders(developerPromptTemplate, {
        phrase,
      });

      const userPrompt = substitutePlaceholders(userPromptTemplate, {
        phrase,
      });

      const assistantPrompt = substitutePlaceholders(assistantPromptTemplate, {
        phrase,
      });

      // generate suggestions
      const result = await openAiService.promptAsJson({
        userPrompt,
        developerPrompt,
        assistantPrompt,
        structuredOutput: {
          schema: SuggestionsSchema,
          schemaName: 'suggestions',
        },
      });

      return result;
    },
  };
};
