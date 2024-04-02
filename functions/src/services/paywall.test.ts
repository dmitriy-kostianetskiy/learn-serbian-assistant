import { CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { Firestore, getFirestore } from '../apis/firestore';
import { v4 as uuid } from 'uuid';
import { Paywall, UserQuota, getPaywall } from './paywall';

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

  test('should let if quote is positive', async () => {
    // Arrange
    const id = '123';
    const userQuota: UserQuota = {
      quota: 1,
    };

    const documentRef = collection.doc(id);

    // add document to the collection
    await documentRef.set(userQuota);

    // Act
    const result = await paywall.try(id);

    // Assert
    expect(result).toBeTruthy();

    const { quota } = (await documentRef.get()).data() as UserQuota;

    expect(quota).toBe(0);
  });

  test('should not let if quote is zero', async () => {
    // Arrange
    const id = '123';
    const userQuota: UserQuota = {
      quota: 0,
    };

    // add document to the collection
    await collection.doc(id).set(userQuota);

    // Act
    const result = await paywall.try(id);

    // Assert
    expect(result).toBeFalsy();
  });
});
