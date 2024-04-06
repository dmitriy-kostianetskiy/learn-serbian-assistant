import admin from 'firebase-admin';

export interface User {
  userName?: string;
  firstName?: string;
  lastName?: string;
  hasPremium: boolean;
  dailyQuotaUsed: number;
}

export type AddUserInput = Omit<User, 'hasPremium' | 'dailyQuotaUsed'>;
export type UpdateUserInput = Partial<User>;
export type UpdateAllUsersInput = Pick<User, 'dailyQuotaUsed'>;

export interface UserRepository {
  add(userId: string, user: AddUserInput): Promise<void>;
  get(userId: string): Promise<User | undefined>;
  update(userId: string, user: UpdateUserInput): Promise<void>;
  updateAll(user: UpdateAllUsersInput): Promise<void>;
}

export const getUserRepository = (
  firebase: admin.firestore.Firestore,
  collectionName = 'user',
): UserRepository => {
  const collection = firebase.collection(collectionName);

  return {
    add: async (userId, user) => {
      const documentRef = collection.doc(userId);
      const documentSnapshot = await documentRef.get();

      if (documentSnapshot.exists) {
        await documentRef.update(user);

        return;
      }

      const newUser: User = {
        ...user,
        hasPremium: false,
        dailyQuotaUsed: 0,
      };

      await documentRef.set(newUser);
    },
    get: async (userId) => {
      const documentRef = collection.doc(userId);
      const documentSnapshot = await documentRef.get();

      return documentSnapshot.data() as User;
    },
    update: async (userId, user) => {
      const documentRef = collection.doc(userId);
      const documentSnapshot = await documentRef.get();

      if (!documentSnapshot.exists) {
        return;
      }

      await documentRef.update(user);
    },
    updateAll: async (user) => {
      // TODO: optimize
      const documents = await collection.get();

      for (const { id } of documents.docs) {
        await collection.doc(id).update(user);
      }
    },
  };
};
