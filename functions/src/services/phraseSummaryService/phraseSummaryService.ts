import { WordData } from '../../model/wordData';
import { substitutePlaceholders } from '../../utils/substitutePlaceholders';
import { ConfigService } from '../configService';
import { OpenAiService } from '../openAiService';

export interface PhraseSummaryService {
  generate(phrase: string): Promise<WordData>;
}

export const getPhraseSummaryService = ({
  openAiService,
  configService,
}: {
  openAiService: OpenAiService;
  configService: ConfigService;
}): PhraseSummaryService => {
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
