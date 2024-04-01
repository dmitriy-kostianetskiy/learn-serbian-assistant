import admin from 'firebase-admin';
import { WordData } from './aiDictionary/model';

export interface WordDataRepository {
  get(word: string): Promise<WordData | undefined>;
  add(wordData: WordData): Promise<void>;
}

export function getWordDataRepository(
  firebase: admin.firestore.Firestore,
): WordDataRepository {
  return {
    get: async (word) => {
      const document = await firebase
        .collection('dictionary')
        .doc(word.toLocaleLowerCase())
        .get();

      if (!document.exists) {
        return undefined;
      }

      return document.data() as WordData;
    },
    add: async (wordData) => {
      await firebase.collection('dictionary').add({
        id: wordData.word,
        ...wordData,
      });
    },
  };
}
