import { Context } from 'telegraf';
import { Dependencies } from '../dependencies';
import { replyToMessage } from '../utils/replyToMessage';

export const paywallMiddleware =
  ({ paywallService }: Pick<Dependencies, 'paywallService'>) =>
  async (context: Context, next: () => Promise<void>) => {
    if (!context.message) {
      return;
    }

    const userId = context.message.from.id.toFixed(0);

    const result = await paywallService.tryPass(userId);

    if (!result.passed) {
      await replyToMessage(context)(result.message, context.message.message_id);

      return;
    }

    await next();
  };
