import { Dependencies } from '../../dependencies';
import { PhraseSummary } from '../../model/phraseSummary';

export type PhraseSummaryServiceDependencies = Pick<
  Dependencies,
  'configService' | 'openAiService'
>;

export interface PhraseSummaryService {
  generate(phrase: string): Promise<PhraseSummary>;
}
