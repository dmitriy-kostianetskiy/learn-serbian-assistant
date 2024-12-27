import { Dependencies } from '../../../dependencies';
import { GenerateSummaryPayload } from '../../../model/generateSummaryPayload';

export type Context = Readonly<{
  dependencies: Dependencies;
  payload: GenerateSummaryPayload;
}>;
