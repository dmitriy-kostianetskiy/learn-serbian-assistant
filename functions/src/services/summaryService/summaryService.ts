import { Dependencies } from '../../dependencies';
import { Summary, SummarySchema } from '../../model/summary';
import { substitutePlaceholders } from '../../utils/substitutePlaceholders';

export type SummaryServiceDependencies = Pick<
  Dependencies,
  'configService' | 'openAiService'
> & {
  summaryUserPromptName?: string;
  summaryDeveloperPromptName?: string;
};

export interface SummaryService {
  generate(phrase: string): Promise<Summary>;
}

export const getSummaryService = ({
  openAiService,
  configService,
  summaryUserPromptName,
  summaryDeveloperPromptName,
}: SummaryServiceDependencies): SummaryService => {
  return {
    async generate(phrase) {
      const [userPromptTemplate, developerPromptTemplate] = await Promise.all([
        configService.get<string>(summaryUserPromptName || 'summaryUserPrompt'),
        configService.get<string>(
          summaryDeveloperPromptName || 'summaryDeveloperPrompt',
        ),
      ]);

      const userPrompt = substitutePlaceholders(userPromptTemplate, {
        phrase,
      });

      const developerPrompt = substitutePlaceholders(developerPromptTemplate, {
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
