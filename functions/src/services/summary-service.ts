import { Dependencies } from '../dependencies';
import { Summary, SummarySchema } from '../model/summary';

export type SummaryServiceDependencies = Pick<
  Dependencies,
  'ai' | 'serverConfig'
>;

export interface SummaryService {
  generate(phrase: string): Promise<Summary>;
}

export const createSummaryService = ({
  ai,
  serverConfig: { summarySystemPrompt },
}: SummaryServiceDependencies): SummaryService => {
  return {
    async generate(phrase) {
      // generate summary
      const summary = await ai.generateObject({
        prompt: phrase,
        system: summarySystemPrompt,
        schema: SummarySchema,
      });

      return summary;
    },
  };
};
