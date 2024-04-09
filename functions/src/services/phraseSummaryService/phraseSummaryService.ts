import { WordData } from '../../model/wordData';
import { substitutePlaceholders } from '../../utils/substitutePlaceholders';
import {
  PhraseSummaryServiceDependencies,
  PhraseSummaryService,
} from './phraseSummaryService.model';

export const getPhraseSummaryService = ({
  openAiService,
  configService,
}: PhraseSummaryServiceDependencies): PhraseSummaryService => {
  return {
    async generate(phrase) {
      const userPromptTemplate = await configService.get(
        'phraseSummaryUserPrompt',
      );
      const systemPromptTemplate = await configService.get(
        'phraseSummarySystemPrompt',
      );

      const userPrompt = substitutePlaceholders(userPromptTemplate, {
        phrase,
      });

      const systemPrompt = substitutePlaceholders(systemPromptTemplate, {
        phrase,
      });

      // TODO: rename word data and repo
      return await openAiService.promptAsJson<WordData>(
        userPrompt,
        systemPrompt,
      );
    },
  };
};
