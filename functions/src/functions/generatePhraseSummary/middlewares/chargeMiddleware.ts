import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { Context } from './context';

export const chargeMiddleware: GenericMiddleware<Context> = async (
  { dependencies: { userService }, payload: { userId } },
  next,
) => {
  await userService.incrementDailyQuotaUsed(userId);

  await next();
};
