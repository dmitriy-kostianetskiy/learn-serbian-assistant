import { Dependencies } from '../../dependencies';
import { WordData } from '../../model/wordData';

export type PhraseSummaryServiceDependencies = Pick<
  Dependencies,
  'configService' | 'openAiService'
>;

export interface PhraseSummaryService {
  generate(phrase: string): Promise<WordData>;
}
