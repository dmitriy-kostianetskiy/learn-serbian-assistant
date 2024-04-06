import { substitutePlaceholders } from '../../utils/substitutePlaceholders';

import { Dependencies } from '../../dependencies';
import { GetPromptInputs, GetPromptResult, PromptService } from './model';
import { hash } from '../../utils/hash';

export const getPrompService = ({
  configService,
}: Pick<Dependencies, 'configService'>): PromptService => {
  return {
    get: async (inputs: GetPromptInputs): Promise<GetPromptResult> => {
      const promptTemplate = await configService.get('wordDataPrompt');

      const prompt = substitutePlaceholders(promptTemplate, inputs);

      const promptHash = hash(prompt);

      return {
        prompt,
        promptHash,
        promptTemplate,
      };
    },
  };
};
