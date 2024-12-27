import { PromptNames, Prompts } from '../model/prompts';
import { Dependencies } from '../dependencies';
import { substitutePlaceholders } from '../utils/substitutePlaceholders';

type PromptBuilderServiceDependencies = Pick<Dependencies, 'configService'>;

export interface PromptBuilderService {
  buildPrompt(
    promptNames: PromptNames,
    inputs: Record<string, string>,
  ): Promise<Prompts>;
}

export const getPromptBuilderService = ({
  configService,
}: PromptBuilderServiceDependencies): PromptBuilderService => {
  return {
    buildPrompt: async (
      { assistantPromptName, developerPromptName, userPromptName },
      inputs,
    ) => {
      const [
        userPromptTemplate,
        developerPromptTemplate,
        assistantPromptTemplate,
      ] = await Promise.all([
        configService.get<string>(userPromptName),
        configService.get<string>(developerPromptName),
        configService.get<string>(assistantPromptName),
      ]);

      const userPrompt = substitutePlaceholders(userPromptTemplate, inputs);
      const developerPrompt = substitutePlaceholders(
        developerPromptTemplate,
        inputs,
      );
      const assistantPrompt = substitutePlaceholders(
        assistantPromptTemplate,
        inputs,
      );

      return {
        userPrompt,
        developerPrompt,
        assistantPrompt,
      };
    },
  };
};
