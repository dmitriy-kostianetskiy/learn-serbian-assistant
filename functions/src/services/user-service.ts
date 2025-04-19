import { FieldValue } from 'firebase-admin/firestore';
import { User, UserDetails } from '../model/user';

export type UpdateUserInput = Partial<User>;

export interface UserService {
  updateUserDetails(
    userId: string | number,
    userDetails: UserDetails,
  ): Promise<User>;
  incrementDailyQuotaUsed(userId: string | number): Promise<void>;
  getDailyQuotaUsed(userId: string | number): Promise<{
    quotaUsed: number;
    hasPremium: boolean;
  }>;
  resetAllDailyQuotaUsed(): Promise<void>;
}

export const getUserService = (
  { firestore }: { firestore: FirebaseFirestore.Firestore },
  collectionName = 'user',
): UserService => {
  const collection = firestore.collection(collectionName);

  const getId = (userId: string | number): string =>
    typeof userId === 'number' ? userId.toFixed(0) : userId;

  return {
    async updateUserDetails(userId, userDetails) {
      const id = getId(userId);

      console.log(`User '${id}': attempt to upsert.`);

      const ref = collection.doc(id);

      const snapshot = await ref.get();

      if (snapshot.exists) {
        await ref.update({
          userId: id,
          userDetails,
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        await ref.set({
          userId: id,
          userDetails,
          hasPremium: false,
          dailyQuotaUsed: 0,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }

      console.log(`User '${id}': user details upserted.`);

      // return current state if the user
      return (await ref.get()).data() as User;
    },
    async getDailyQuotaUsed(userId) {
      const id = getId(userId);

      const ref = collection.doc(id);

      const snapshot = await ref.get();

      if (!snapshot.exists) {
        return {
          quotaUsed: 0,
          hasPremium: false,
        };
      }

      const user = snapshot.data() as User;

      return {
        quotaUsed: user.dailyQuotaUsed || 0,
        hasPremium: user.hasPremium || false,
      };
    },
    async incrementDailyQuotaUsed(userId) {
      const id = getId(userId);

      console.log(`User '${id}': attempt to increment daily quota usage.`);

      const ref = collection.doc(id);

      await ref.set(
        {
          dailyQuotaUsed: FieldValue.increment(1),
        },
        // these fields will be updated if document already exists in firestore
        {
          mergeFields: ['dailyQuotaUsed'],
        },
      );

      console.log(`User '${id}': daily quota usage incremented.`);
    },
    async resetAllDailyQuotaUsed() {
      const batch = firestore.batch();
      const documents = await collection.select().get();

      documents.docs.forEach(({ id }) => {
        batch.update(collection.doc(id), {
          dailyQuotaUsed: 0,
          updatedAt: FieldValue.serverTimestamp(),
          dailyQuotaResetAt: FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();

      console.warn('All users are updated');
    },
  };
};
