import { FieldValue } from 'firebase-admin/firestore';

export type UserDetails = Readonly<{
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}>;

export type User = Readonly<{
  hasPremium: boolean;
  dailyQuotaUsed: number;
  userDetails: UserDetails;
}>;

export type UpdateUserInput = Partial<User>;

export interface UserService {
  getOrCreate(userId: string | number, userDetails: UserDetails): Promise<User>;
  incrementDailyQuotaUsed(userId: string | number): Promise<void>;
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
    async getOrCreate(userId, userDetails) {
      const id = getId(userId);

      console.log(`User '${id}': attempt to upsert.`);

      const documentRef = collection.doc(id);
      const documentSnapshot = await documentRef.get();

      if (documentSnapshot.exists) {
        await documentRef.update({
          userDetails,
        });

        console.log(`User '${id}': user details updated.`);
      } else {
        await documentRef.set({
          userDetails,
          hasPremium: false,
          dailyQuotaUsed: 0,
        });

        console.log(`User '${id}': user details created.`);
      }

      return (await documentRef.get()).data() as User;
    },
    async incrementDailyQuotaUsed(userId) {
      const id = getId(userId);

      console.log(`User '${id}': attempt to increment daily quota usage.`);

      const documentRef = collection.doc(id);

      await documentRef.update({
        dailyQuotaUsed: FieldValue.increment(1),
      });

      console.log(`User '${id}': daily quota usage incremented.`);
    },
    async resetAllDailyQuotaUsed() {
      // TODO: optimize
      const documents = await collection.get();

      for (const { id } of documents.docs) {
        await collection.doc(id).update({ dailyQuotaUsed: 0 });
      }

      console.warn('All users are updated');
    },
  };
};
