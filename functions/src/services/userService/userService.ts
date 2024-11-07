import { FieldValue } from 'firebase-admin/firestore';
import { User, UserDetails } from '../../model/user';

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

  const createNewUser = (userId: string): User => ({
    userId,
    dailyQuotaUsed: 0,
    hasPremium: false,
    userDetails: {},
  });

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
        const newUser = createNewUser(id);

        await documentRef.set({
          ...newUser,
          userDetails,
        });

        console.log(`User '${id}': user details created.`);
      }

      return (await documentRef.get()).data() as User;
    },
    async incrementDailyQuotaUsed(userId) {
      const id = getId(userId);

      console.log(`User '${id}': attempt to increment daily quota usage.`);

      const documentRef = collection.doc(id);
      const documentSnapshot = await documentRef.get();

      if (!documentSnapshot.exists) {
        const newUser = createNewUser(id);

        await documentRef.set(newUser);
      }

      await documentRef.update({
        dailyQuotaUsed: FieldValue.increment(1),
      });

      console.log(`User '${id}': daily quota usage incremented.`);
    },
    async resetAllDailyQuotaUsed() {
      const batch = firestore.batch();
      const documents = await collection.select().get();

      documents.docs.forEach(({ id }) => {
        batch.update(collection.doc(id), { dailyQuotaUsed: 0 });
      });

      await batch.commit();

      console.warn('All users are updated');
    },
  };
};
