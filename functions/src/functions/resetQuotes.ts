import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getPaywallService } from '../services/paywallService/paywallService';
import { getFirestore } from '../apis/firestore';
import { getUserRepository } from '../services/userRepository';

export const resetQuotes = onSchedule(
  {
    schedule: 'every day 00:00',
    region: 'europe-west1',
  },
  async () => {
    const firestore = getFirestore();
    const userRepository = getUserRepository(firestore);
    const paywall = getPaywallService({ userRepository });

    await paywall.reset();
  },
);
