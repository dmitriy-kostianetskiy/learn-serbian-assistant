import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { OPEN_AI_KEY, TELEGRAM_BOT_TOKEN } from '../../params';
import { GeneratePhraseSummaryPayload } from '../../model/generatePhraseSummaryPayload';
import { getDependencies } from '../../dependencies';
import { compose } from '../../utils/genericMiddleware';
import { paywallMiddleware } from './middlewares/paywallMiddleware';
import { suggestionsMiddleware } from './middlewares/suggestionsMiddleware';
import { Context } from './middlewares/context';
import { phraseSummaryMiddleware } from './middlewares/phraseSummaryMiddleware';
import { Topic } from '../../consts/topic';
import { chargeMiddleware } from './middlewares/chargeMiddleware';
import { replyToMessageWithHtml } from '../../utils/replyToMessageWithHtml';
import { Message } from '../../consts/message';

export const generatePhraseSummary =
  onMessagePublished<GeneratePhraseSummaryPayload>(
    {
      topic: Topic.PhraseSummary,
      region: 'europe-west1',
      secrets: [TELEGRAM_BOT_TOKEN, OPEN_AI_KEY],
    },
    async ({
      data: {
        message: { json: payload },
      },
    }) => {
      const dependencies = getDependencies({
        telegramBotToken: TELEGRAM_BOT_TOKEN.value(),
        openAiKey: OPEN_AI_KEY.value(),
      });

      try {
        const context: Context = {
          dependencies,
          payload,
        };

        const composedMiddleware = compose(
          paywallMiddleware,
          suggestionsMiddleware,
          phraseSummaryMiddleware,
          chargeMiddleware,
        );

        await composedMiddleware(context);
      } catch (error) {
        console.error(error);

        await replyToMessageWithHtml(dependencies.telegram)(
          Message.ErrorMessage,
          { chatId: payload.chatId, messageId: payload.messageId },
        );
      }
    },
  );
