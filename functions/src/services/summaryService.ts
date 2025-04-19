import { Dependencies } from '../dependencies';
import { Summary, SummarySchema } from '../model/summary';

export type SummaryServiceDependencies = Pick<
  Dependencies,
  'ai' | 'promptBuilderService'
> & {
  promptName: string;
};

export interface SummaryService {
  generate(phrase: string): Promise<Summary>;
}

export const getSummaryService = ({
  ai,
  promptBuilderService,
  promptName,
}: SummaryServiceDependencies): SummaryService => {
  return {
    async generate(phrase) {
      // get prompts
      const prompts = await promptBuilderService.buildPrompt(promptName, {
        phrase,
      });

      // generate summary
      const summary = await ai.generateObject({
        prompts,
        schema: SummarySchema,
      });

      return summary;
    },
  };
};
