import { replyToMessageWithHtml } from '../../../utils/replyToMessageWithHtml';
import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { Dependencies } from '../../../dependencies';
import { GeneratePhraseSummaryPayload } from '../../../model/generatePhraseSummaryPayload';
import { Message } from '../../../consts/message';

export const paywallMiddleware: GenericMiddleware<{
  dependencies: Pick<
    Dependencies,
    'configService' | 'userService' | 'telegram' | 'eventsService'
  >;
  payload: GeneratePhraseSummaryPayload;
}> = async (
  {
    dependencies: { configService, userService, telegram, eventsService },
    payload,
  },
  next,
) => {
  const { messageId, chatId, userId, userDetails } = payload;

  const [user, dailyQuota] = await Promise.all([
    userService.getOrCreate(userId, userDetails),
    configService.get('dailyQuota'),
  ]);

  if (user.dailyQuotaUsed >= dailyQuota && !user.hasPremium) {
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
