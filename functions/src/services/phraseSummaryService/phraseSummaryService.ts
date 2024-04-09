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
      const promptTemplate = await configService.get('phraseSummaryPrompt');
      const prompt = substitutePlaceholders(promptTemplate, {
        phrase,
      });

      // TODO: rename word data and repo
      return await openAiService.promptAsJson<WordData>(prompt);
    },
  };
};
