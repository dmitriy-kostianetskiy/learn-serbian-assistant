import admin from 'firebase-admin';

interface UserQuota {
  quota: number;
}

export interface Paywall {
  try(userId: string): Promise<boolean>;
  reset(userId: string): Promise<void>;
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
      documentRef.set(document);

      return true;
    },
    reset: async (userId) => {
      const documentRef = collection.doc(userId);

      await documentRef.delete();
    },
  };
}
