import { CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { Firestore, getFirestore } from '../apis/firestore';
import {
  WordDataRepository,
  getWordDataRepository,
} from './wordDataRepository';
import { v4 as uuid } from 'uuid';
import { WordData } from './aiDictionary/model';

describe('word data repository', () => {
  let firestore: Firestore;
  let repository: WordDataRepository;
  let collection: CollectionReference<DocumentData>;

  beforeAll(async () => {
    firestore = getFirestore();
  });

  beforeEach(async () => {
    // create collection with random name for testing
    const testCollection = `test-${uuid()}`;
    collection = firestore.collection(testCollection);

    // create repository
    repository = getWordDataRepository(firestore, testCollection);
  });

  afterEach(async () => {
    const documents = await collection.get();

    for (const { id } of documents.docs) {
      await collection.doc(id).delete();
    }
  });

  test('should return word data if it exists in db', async () => {
    // Arrange
    const word = 'kurac';

    // add document to the collection
    await collection.doc(word).set({
      word,
    });

    // Act
    const wordData = await repository.get(word);

    // Assert
    expect(wordData).toBeTruthy();
  });

  test('should return undefined if word data does not exists in db', async () => {
    // Arrange
    const word = 'kurac';

    // Act
    const wordData = await repository.get(word);

    // Assert
    expect(wordData).toBeUndefined();
  });

  test('should add a document', async () => {
    // Arrange
    const word = 'kurac';

    const wordData: WordData = {
      word,
    } as WordData;

    // Act
    await repository.add(wordData);

    // Assert
    const dbWordData = await collection.doc(word).get();

    expect(dbWordData.exists).toBeTruthy();
    expect(dbWordData.data()).toBeTruthy();
  });
});
