import { CacheService } from './cacheService.model';

export const getCacheService = <T extends object>(
  cacheName: string,
  {
    firestore,
  }: {
    firestore: FirebaseFirestore.Firestore;
  },
): CacheService<T> => {
  const collection = firestore.collection(cacheName);

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

      await documentRef.set(value);
    },
  };
};
