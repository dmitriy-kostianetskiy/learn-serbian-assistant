import { UserRepository } from './userRepository';

export class UnableToPassPaywallError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export interface Paywall {
  pass(userId: string): Promise<void>;
  reset(): Promise<void>;
}

export function getPaywall(
  userRepository: UserRepository,
  defaultQuota = 10,
): Paywall {
  return {
    pass: async (userId) => {
      const user = await userRepository.get(userId);

      if (!user) {
        console.log(
          `User ${userId} failed to pass paywall: unable to find the user.`,
        );

        throw new UnableToPassPaywallError('Please run /start command.');
      }

      if (user.dailyQuotaUsed >= defaultQuota && !user.hasPremium) {
        console.log(
          `User ${userId} failed to pass paywall: daily quota exceeded.`,
        );

        throw new UnableToPassPaywallError(
          'You have exceeded daily usage limit. Please try again tomorrow.',
        );
      }

      const oldDailyQuota = user.dailyQuotaUsed || 0;
      const newDailyQuota = oldDailyQuota + 1;

      await userRepository.update(userId, {
        dailyQuotaUsed: newDailyQuota,
      });

      console.log(
        `User ${userId} passed paywall: daily quota usage updated from ${oldDailyQuota} to ${newDailyQuota}`,
      );
    },
    reset: async () => {
      await userRepository.updateAll({ dailyQuotaUsed: 0 });

      console.log('Daily quota reset for all users');
    },
  };
}
