import admin from 'firebase-admin';
import { WordData } from '../model/wordData';

export interface WordDataRepository {
  get(id: string): Promise<WordData | undefined>;
  add(id: string, wordData: WordData): Promise<void>;
}

export const getWordDataRepository = (
  firebase: admin.firestore.Firestore,
  collectionName = 'dictionary',
): WordDataRepository => {
  const collection = firebase.collection(collectionName);

  return {
    get: async (id) => {
      const document = await collection.doc(id).get();

      if (!document.exists) {
        return undefined;
      }

      return document.data() as WordData;
    },
    add: async (id, wordData) => {
      await collection.doc(id).set(wordData);
    },
  };
};
