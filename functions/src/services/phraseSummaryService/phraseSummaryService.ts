import { PhraseSummary } from '../../model/phraseSummary';
import { substitutePlaceholders } from '../../utils/substitutePlaceholders';
import {
  PhraseSummaryService,
  PhraseSummaryServiceDependencies,
} from './phraseSummaryService.model';
import { validatePhraseSummary } from './validatePhraseSummary';

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

      const summary = await openAiService.promptAsJson<PhraseSummary>(
        userPrompt,
        systemPrompt,
      );

      const summaryValidation = validatePhraseSummary(summary);

      if (!summaryValidation.passed) {
        console.error(
          'Generation summary validation failed.',
          summaryValidation.errors,
        );
      }

      return summary;
    },
  };
};
