import { Dependencies } from '../../../dependencies';
import { GeneratePhraseSummaryPayload } from '../../../model/generatePhraseSummaryPayload';

export type Context = Readonly<{
  dependencies: Dependencies;
  payload: GeneratePhraseSummaryPayload;
}>;
