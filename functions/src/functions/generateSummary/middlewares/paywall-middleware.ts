import { replyToMessageWithHtml } from '../../../utils/replyToMessageWithHtml';
import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { Dependencies } from '../../../dependencies';
import { GenerateSummaryPayload } from '../../../model/generateSummaryPayload';
import { Message } from '../../../consts/message';

export const paywallMiddleware: GenericMiddleware<{
  dependencies: Pick<
    Dependencies,
    'userService' | 'telegram' | 'eventsService' | 'serverConfig'
  >;
  payload: GenerateSummaryPayload;
}> = async (
  {
    dependencies: { userService, telegram, eventsService, serverConfig },
    payload,
  },
  next,
) => {
  const { messageId, chatId, userId } = payload;

  const { quotaUsed, hasPremium } = await userService.getDailyQuotaUsed(userId);

  if (quotaUsed >= serverConfig.dailyQuota && !hasPremium) {
    console.log(
      `User '${userId}' failed to pass paywall: daily quota exceeded.`,
    );

    await eventsService.add({
      type: 'daily-quota-exceeded',
      payload,
    });

    return await replyToMessageWithHtml(telegram)(Message.DailyLimitExceeded, {
      chatId,
      messageId,
    });
  }

  console.log(`User '${userId}' passed paywall.`);

  await next();
};
