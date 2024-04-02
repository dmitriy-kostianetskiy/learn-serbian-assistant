import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getPaywall } from '../services/paywall';
import { getFirestore } from '../apis/firestore';

export const resetQuotes = onSchedule(
  {
    schedule: 'every day 00:00',
    region: 'europe-west1',
  },
  async () => {
    const firestore = getFirestore();
    const paywall = getPaywall(firestore);

    await paywall.reset();
  },
);
