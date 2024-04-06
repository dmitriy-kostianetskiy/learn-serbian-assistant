import { Dependencies } from '../../dependencies';
import { PaywallService } from './paywallService.model';

export const getPaywallService = ({
  userRepository,
}: Pick<Dependencies, 'userRepository'>): PaywallService => {
  return {
    tryPass: async (userId) => {
      // TODO: move to config
      const defaultQuota = 10;
      const user = await userRepository.get(userId);

      if (!user || (user.dailyQuotaUsed >= defaultQuota && !user.hasPremium)) {
        console.log(
          `User ${userId} failed to pass paywall: daily quota exceeded.`,
        );

        return {
          passed: false,
          message:
            'You have exceeded daily usage limit. Please try again tomorrow.',
        };
      }

      const oldDailyQuota = user.dailyQuotaUsed || 0;
      const newDailyQuota = oldDailyQuota + 1;

      await userRepository.update(userId, {
        dailyQuotaUsed: newDailyQuota,
      });

      console.log(
        `User ${userId} passed paywall: daily quota usage updated from ${oldDailyQuota} to ${newDailyQuota}`,
      );

      return {
        passed: true,
      };
    },
    reset: async () => {
      await userRepository.updateAll({ dailyQuotaUsed: 0 });

      console.log('Daily quota reset for all users');
    },
  };
};
