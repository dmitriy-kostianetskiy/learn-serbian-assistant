import { replyToMessageWithHtml } from '../../../utils/replyToMessageWithHtml';
import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { Dependencies } from '../../../dependencies';
import { GenerateSummaryPayload } from '../../../model/generateSummaryPayload';
import { Message } from '../../../consts/message';

export const paywallMiddleware: GenericMiddleware<{
  dependencies: Pick<
    Dependencies,
    'configService' | 'userService' | 'telegram' | 'eventsService'
  >;
  payload: GenerateSummaryPayload;
}> = async (
  {
    dependencies: { configService, userService, telegram, eventsService },
    payload,
  },
  next,
) => {
  const { messageId, chatId, userId } = payload;

  const [{ quotaUsed, hasPremium }, dailyQuota] = await Promise.all([
    userService.getDailyQuotaUsed(userId),
    configService.get<number>('dailyQuota'),
  ]);

  if (quotaUsed >= dailyQuota && !hasPremium) {
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
