import { Context } from 'telegraf';
import { Dependencies } from '../../../dependencies';
import { createPayload } from './createPayload';

export type HandleTextMiddlewareDependencies = Pick<
  Dependencies,
  'phraseSummaryQueueService'
>;

export const handleTextMiddleware =
  ({ phraseSummaryQueueService }: HandleTextMiddlewareDependencies) =>
  async ({ text, from, chat, message }: Context) => {
    try {
      if (!text || !from || !chat) {
        return;
      }

      const payload = createPayload(
        text.toLowerCase(),
        from,
        chat.id,
        message?.message_id,
      );

      await phraseSummaryQueueService.add(payload);
    } catch (e) {
      console.error(e);
    }
  };
