import { replyToMessageWithHtml } from '../../../utils/replyToMessageWithHtml';
import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { Dependencies } from '../../../dependencies';
import { GeneratePhraseSummaryPayload } from '../../../model/generatePhraseSummaryPayload';

export const paywallMiddleware: GenericMiddleware<{
  dependencies: Pick<
    Dependencies,
    'configService' | 'userService' | 'telegram'
  >;
  payload: Pick<
    GeneratePhraseSummaryPayload,
    'messageId' | 'chatId' | 'userId' | 'userDetails'
  >;
}> = async (
  {
    dependencies: { configService, userService, telegram },
    payload: { messageId, chatId, userId, userDetails },
  },
  next,
) => {
  const [user, dailyQuota] = await Promise.all([
    userService.getOrCreate(userId, userDetails),
    configService.get('dailyQuota'),
  ]);

  if (user.dailyQuotaUsed >= dailyQuota && !user.hasPremium) {
    console.log(
      `User '${userId}' failed to pass paywall: daily quota exceeded.`,
    );

    return await replyToMessageWithHtml(telegram)(
      'You have exceeded daily usage limit. Please try again tomorrow.',
      {
        chatId,
        messageId,
      },
    );
  }

  console.log(`User '${userId}' passed paywall.`);

  await next();
};
