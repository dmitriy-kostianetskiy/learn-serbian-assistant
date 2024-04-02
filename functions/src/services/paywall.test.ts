import { CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { Firestore, getFirestore } from '../apis/firestore';
import { v4 as uuid } from 'uuid';
import { Paywall, User, getPaywall } from './paywall';

describe('paywall', () => {
  let firestore: Firestore;
  let paywall: Paywall;
  let collection: CollectionReference<DocumentData>;

  beforeAll(async () => {
    firestore = getFirestore();
  });

  beforeEach(async () => {
    // create collection with random name for testing
    const testCollection = `paywall-test-${uuid()}`;
    collection = firestore.collection(testCollection);

    // create repository
    paywall = getPaywall(firestore, testCollection);
  });

  afterEach(async () => {
    const documents = await collection.get();

    for (const { id } of documents.docs) {
      await collection.doc(id).delete();
    }
  });

  test('should let if limit is not exceeded', async () => {
    // Arrange
    const id = '123';
    const userQuota: User = {
      used: 9,
      hasPremium: false,
    };

    const documentRef = collection.doc(id);

    // add document to the collection
    await documentRef.set(userQuota);

    // Act
    const result = await paywall.try(id);

    // Assert
    expect(result).toBeTruthy();

    const { used } = (await documentRef.get()).data() as User;

    expect(used).toBe(10);
  });

  test('should not let if limit is exceeded', async () => {
    // Arrange
    const id = '123';
    const userQuota: User = {
      used: 10,
      hasPremium: false,
    };

    // add document to the collection
    await collection.doc(id).set(userQuota);

    // Act
    const result = await paywall.try(id);

    // Assert
    expect(result).toBeFalsy();
  });

  test('should let if limit is exceeded and has premium', async () => {
    // Arrange
    const id = '123';
    const userQuota: User = {
      used: 10,
      hasPremium: true,
    };
    const documentRef = collection.doc(id);

    // add document to the collection
    await documentRef.set(userQuota);

    // Act
    const result = await paywall.try(id);

    // Assert
    expect(result).toBeTruthy();

    const { used } = (await documentRef.get()).data() as User;

    expect(used).toBe(11);
  });
});
