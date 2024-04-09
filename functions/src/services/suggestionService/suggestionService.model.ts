import { Dependencies } from '../../dependencies';
import { Suggestions } from '../../model/suggestions';

export type SuggestionServiceDependencies = Pick<
  Dependencies,
  'configService' | 'openAiService'
>;

export interface SuggestionService {
  generate(phrase: string): Promise<Suggestions>;
}
