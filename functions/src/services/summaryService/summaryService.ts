import { Dependencies } from '../../dependencies';
import { Summary, SummarySchema } from '../../model/summary';
import { substitutePlaceholders } from '../../utils/substitutePlaceholders';

export type SummaryServiceDependencies = Pick<
  Dependencies,
  'configService' | 'openAiService'
> & {
  summaryUserPromptName?: string;
  summarySystemPromptName?: string;
};

export interface SummaryService {
  generate(phrase: string): Promise<Summary>;
}

export const getSummaryService = ({
  openAiService,
  configService,
  summaryUserPromptName,
  summarySystemPromptName,
}: SummaryServiceDependencies): SummaryService => {
  return {
    async generate(phrase) {
      const [userPromptTemplate, systemPromptTemplate] = await Promise.all([
        configService.get<string>(summaryUserPromptName || 'summaryUserPrompt'),
        configService.get<string>(
          summarySystemPromptName || 'summarySystemPrompt',
        ),
      ]);

      const userPrompt = substitutePlaceholders(userPromptTemplate, {
        phrase,
      });

      const developerPrompt = substitutePlaceholders(systemPromptTemplate, {
        phrase,
      });

      const summary = await openAiService.promptAsJson({
        userPrompt,
        developerPrompt,
        structuredOutput: {
          schema: SummarySchema,
          schemaName: 'summary',
        },
      });

      return summary;
    },
  };
};
