import { Dependencies } from '../../dependencies';

export type PhraseSummaryServiceDependencies = Pick<
  Dependencies,
  'configService' | 'openAiService'
>;

export interface PhraseSummaryService {
  generate(phrase: string): Promise<string>;
}
