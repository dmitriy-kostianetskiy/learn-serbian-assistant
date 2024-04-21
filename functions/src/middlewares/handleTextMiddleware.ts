import { Context } from 'telegraf';
import { Dependencies } from '../dependencies';
import { createPayload } from './createPayload';

export type HandleTextMiddlewareDependencies = Pick<
  Dependencies,
  'phraseSummaryQueueService'
>;

export const handleTextMiddleware =
  ({ phraseSummaryQueueService }: HandleTextMiddlewareDependencies) =>
  async (context: Context) => {
    try {
      const payload = createPayload(
        context.text!,
        context.message!,
        context.chat!,
      );

      await phraseSummaryQueueService.add(payload);
    } catch (e) {
      console.error(e);
    }
  };
