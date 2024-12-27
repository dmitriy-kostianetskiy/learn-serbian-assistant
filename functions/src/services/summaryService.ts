import { Dependencies } from '../dependencies';
import { PromptNames } from '../model/prompts';
import { Summary, SummarySchema } from '../model/summary';

export type SummaryServiceDependencies = Pick<
  Dependencies,
  'openAiService' | 'promptBuilderService'
> &
  PromptNames;

export interface SummaryService {
  generate(phrase: string): Promise<Summary>;
}

export const getSummaryService = ({
  openAiService,
  promptBuilderService,
  ...promptNames
}: SummaryServiceDependencies): SummaryService => {
  return {
    async generate(phrase) {
      // get prompts
      const prompts = await promptBuilderService.buildPrompt(promptNames, {
        phrase,
      });

      // generate summary
      const summary = await openAiService.promptAsJson({
        prompts,
        structuredOutput: {
          schema: SummarySchema,
          schemaName: 'summary',
        },
      });

      return summary;
    },
  };
};
