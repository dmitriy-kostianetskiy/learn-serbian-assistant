import { Dependencies } from '../../dependencies';
import { Summary, SummarySchema } from '../../model/summary';
import { substitutePlaceholders } from '../../utils/substitutePlaceholders';

export type SummaryServiceDependencies = Pick<
  Dependencies,
  'configService' | 'openAiService'
> & {
  userPromptName?: string;
  developerPromptName?: string;
  assistantPromptName?: string;
};

export interface SummaryService {
  generate(phrase: string): Promise<Summary>;
}

export const getSummaryService = ({
  openAiService,
  configService,
  userPromptName,
  developerPromptName,
  assistantPromptName,
}: SummaryServiceDependencies): SummaryService => {
  return {
    async generate(phrase) {
      const [
        userPromptTemplate,
        developerPromptTemplate,
        assistantPromptTemplate,
      ] = await Promise.all([
        configService.get<string>(userPromptName || 'summaryUserPrompt'),
        configService.get<string>(
          developerPromptName || 'summaryDeveloperPrompt',
        ),
        configService.get<string>(
          assistantPromptName || 'summaryAssistantPrompt',
        ),
      ]);

      const userPrompt = substitutePlaceholders(userPromptTemplate, {
        phrase,
      });

      const developerPrompt = substitutePlaceholders(developerPromptTemplate, {
        phrase,
      });

      const assistantPrompt = substitutePlaceholders(assistantPromptTemplate, {
        phrase,
      });

      const summary = await openAiService.promptAsJson({
        userPrompt,
        developerPrompt,
        assistantPrompt,
        structuredOutput: {
          schema: SummarySchema,
          schemaName: 'summary',
        },
      });

      return summary;
    },
  };
};
