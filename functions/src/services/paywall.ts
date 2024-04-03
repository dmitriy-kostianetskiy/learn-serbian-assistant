import { UserRepository } from './userRepository';

export interface Paywall {
  try(userId: string): Promise<boolean>;
  reset(): Promise<void>;
}

export function getPaywall(
  userRepository: UserRepository,
  defaultQuota = 100,
): Paywall {
  return {
    try: async (userId) => {
      const user = await userRepository.get(userId);

      if (!user) {
        return false;
      }

      if (user.dailyQuotaUsed >= defaultQuota && !user.hasPremium) {
        return false;
      }

      await userRepository.update(userId, {
        dailyQuotaUsed: (user.dailyQuotaUsed || 0) + 1,
      });

      return true;
    },
    reset: async () => {
      await userRepository.updateAll({ dailyQuotaUsed: 0 });
    },
  };
}
