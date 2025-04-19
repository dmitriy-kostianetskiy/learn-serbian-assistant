import { Prompts } from '../model/prompts';
import { Dependencies } from '../dependencies';
import { substitutePlaceholders } from '../utils/substitutePlaceholders';

type PromptBuilderServiceDependencies = Pick<Dependencies, 'configService'>;

export interface PromptBuilderService {
  buildPrompt(
    promptName: string,
    inputs: Record<string, string>,
  ): Promise<Prompts>;
}

export const createPromptBuilderService = ({
  configService,
}: PromptBuilderServiceDependencies): PromptBuilderService => {
  return {
    buildPrompt: async (promptName, inputs) => {
      const [userPromptTemplate, systemPromptTemplate] = await Promise.all([
        configService.get<string>(`${promptName}UserPrompt`),
        configService.get<string>(`${promptName}SystemPrompt`),
      ]);

      const userPrompt = substitutePlaceholders(userPromptTemplate, inputs);
      const systemPrompt = substitutePlaceholders(systemPromptTemplate, inputs);

      return {
        userPrompt,
        systemPrompt,
      };
    },
  };
};
