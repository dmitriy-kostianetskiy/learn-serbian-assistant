import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { Context } from './context';

export const chargeMiddleware: GenericMiddleware<Context> = async (
  { dependencies: { userService, eventsService }, payload },
  next,
) => {
  const { userId } = payload;

  await userService.incrementDailyQuotaUsed(userId);

  await eventsService.add({
    type: 'charged',
    payload,
  });

  await next();
};
