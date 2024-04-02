import admin from 'firebase-admin';

export interface User {
  used: number;
  hasPremium: boolean;
}

export interface Paywall {
  try(userId: string): Promise<boolean>;
  reset(): Promise<void>;
}

export function getPaywall(
  firebase: admin.firestore.Firestore,
  collectionName = 'paywall',
  defaultQuota = 10,
): Paywall {
  const collection = firebase.collection(collectionName);

  const defaultUserDocument: User = {
    used: 0,
    hasPremium: false,
  };

  return {
    try: async (userId) => {
      const documentRef = collection.doc(userId);
      const documentSnapshot = await documentRef.get();

      const { used, hasPremium } =
        (documentSnapshot.data() as User) ?? defaultUserDocument;

      if (used >= defaultQuota && !hasPremium) {
        return false;
      }

      await documentRef.update({
        used: used + 1,
      });

      return true;
    },
    reset: async () => {
      const documents = await collection.get();

      for (const { id } of documents.docs) {
        const document: Partial<User> = {
          used: 0,
        };

        await collection.doc(id).update(document);
      }
    },
  };
}
