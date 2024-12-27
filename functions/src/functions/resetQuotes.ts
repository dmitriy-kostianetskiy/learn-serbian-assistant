import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore } from '../apis/firestore';
import { getUserService } from '../services/userService';

export const resetQuotes = onSchedule(
  {
    schedule: 'every day 00:00',
    region: 'europe-west1',
  },
  async () => {
    const firestore = getFirestore();

    const userService = getUserService({ firestore });

    await userService.resetAllDailyQuotaUsed();
  },
);
