import admin from 'firebase-admin';

export interface UserQuota {
  quota: number;
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

  return {
    try: async (userId) => {
      const documentRef = collection.doc(userId);
      const documentSnapshot = await documentRef.get();

      const document = (documentSnapshot.data() as UserQuota) ?? {
        quota: defaultQuota,
      };

      if (document.quota <= 0) {
        return false;
      }

      document.quota = document.quota - 1;
      await documentRef.set(document);

      return true;
    },
    reset: async () => {
      const documents = await collection.get();

      for (const { id } of documents.docs) {
        await collection.doc(id).delete();
      }
    },
  };
}
