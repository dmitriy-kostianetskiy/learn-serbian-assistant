import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { GenerateSummaryPayload } from '../../model/generateSummaryPayload';
import { getDependencies } from '../../dependencies';
import { compose } from '../../utils/genericMiddleware';
import { paywallMiddleware } from './middlewares/paywallMiddleware';
import { suggestionsMiddleware } from './middlewares/suggestionsMiddleware';
import { Context } from './middlewares/context';
import { summaryMiddleware } from './middlewares/summaryMiddleware';
import { PubSubTopic } from '../../consts/pubSubTopic';
import { chargeMiddleware } from './middlewares/chargeMiddleware';
import { replyToMessageWithHtml } from '../../utils/replyToMessageWithHtml';
import { Message } from '../../consts/message';
import { Secret } from '../../consts/secret';

export const generateSummary = onMessagePublished<GenerateSummaryPayload>(
  {
    topic: PubSubTopic.Summary,
    region: 'europe-west1',
    secrets: [Secret.TelegramBotToken, Secret.OpenAiKey],
  },
  async ({
    data: {
      message: { json: payload },
    },
  }) => {
    const dependencies = getDependencies({
      telegramBotToken: Secret.TelegramBotToken.value(),
      openAiKey: Secret.OpenAiKey.value(),
    });

    try {
      const context: Context = {
        dependencies,
        payload,
      };

      dependencies.eventsService.add({
        type: 'summary-request',
        payload,
      });

      await dependencies.userService.updateUserDetails(
        payload.userId,
        payload.userDetails,
      );

      const composedMiddleware = compose(
        paywallMiddleware,
        suggestionsMiddleware,
        summaryMiddleware,
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