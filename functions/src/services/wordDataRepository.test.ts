import { getFirestore } from '../apis/firestore';
import {
  WordDataRepository,
  getWordDataRepository,
} from './wordDataRepository';
import { v4 as uuid } from 'uuid';
import { WordData } from '../model/wordData';
import { deleteCollection } from '../utils/deleteCollection';
import {
  CollectionReference,
  DocumentData,
  Firestore,
} from 'firebase-admin/firestore';

describe('WordDataRepository', () => {
  let firestore: Firestore;
  let repository: WordDataRepository;
  let collection: CollectionReference<DocumentData>;

  beforeAll(async () => {
    firestore = getFirestore();
  });

  beforeEach(async () => {
    // create collection with random name for testing
    const testCollection = `dictionary-test-${uuid()}`;
    collection = firestore.collection(testCollection);

    // create repository
    repository = getWordDataRepository(firestore, testCollection);
  });

  afterEach(async () => {
    await deleteCollection(collection);
  });

  test('should return word data if it exists in db', async () => {
    // Arrange
    const id = 'id-1';
    const word = 'kurac';

    // add document to the collection
    await collection.doc(id).set({
      word,
    });

    // Act
    const wordData = await repository.get(id);

    // Assert
    expect(wordData).toBeTruthy();
  });

  test('should return undefined if word data does not exists in db', async () => {
    // Arrange
    const id = 'id-1';

    // Act
    const wordData = await repository.get(id);

    // Assert
    expect(wordData).toBeUndefined();
  });

  test('should add a document', async () => {
    // Arrange
    const id = 'id-1';
    const word = 'kurac';

    const wordData: WordData = {
      phrase: word,
    } as WordData;

    // Act
    await repository.add(id, wordData);

    // Assert
    const dbWordData = await collection.doc(id).get();

    expect(dbWordData.exists).toBeTruthy();
    expect(dbWordData.data()).toBeTruthy();
  });
});
