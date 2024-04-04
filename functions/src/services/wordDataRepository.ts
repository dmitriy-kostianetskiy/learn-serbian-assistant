import admin from 'firebase-admin';
import { WordData } from './aiDictionary/model';

export interface WordDataRepository {
  get(word: string): Promise<WordData | undefined>;
  add(wordData: WordData): Promise<void>;
}

export function getWordDataRepository(
  firebase: admin.firestore.Firestore,
  collectionName = 'dictionary',
): WordDataRepository {
  const collection = firebase.collection(collectionName);

  return {
    get: async (word) => {
      const document = await collection.doc(word.toLowerCase()).get();

      if (!document.exists) {
        return undefined;
      }

      return document.data() as WordData;
    },
    add: async (wordData) => {
      await collection.doc(wordData.word.toLowerCase()).set(wordData);
    },
  };
}
