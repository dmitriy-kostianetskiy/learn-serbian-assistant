import { FieldValue } from 'firebase-admin/firestore';
import { StorageService } from './storageService.model';

export const getStorageService = <T extends object>(
  storageName: string,
  {
    firestore,
  }: {
    firestore: FirebaseFirestore.Firestore;
  },
): StorageService<T> => {
  const collection = firestore.collection(storageName);

  return {
    async get<T>(key: string): Promise<T | null> {
      const documentRef = collection.doc(key);

      const documentSnapshot = await documentRef.get();

      if (!documentSnapshot.exists) {
        return null;
      }

      const documentData = documentSnapshot.data();

      if (!documentData) {
        return null;
      }

      return documentData as T;
    },
    async set<T extends object>(key: string, value: T): Promise<void> {
      const documentRef = collection.doc(key);

      await documentRef.set({
        ...value,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      });
    },
  };
};
