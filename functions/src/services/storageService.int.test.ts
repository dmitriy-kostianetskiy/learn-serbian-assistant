import { getFirestore } from 'firebase-admin/firestore';
import {
  deleteCollection,
  getFromCollection,
  insertIntoCollection,
} from '../utils/firebaseUtils';
import { getStorageService, StorageService } from './storageService';
import { randomUUID } from 'crypto';

type StorageItem = {
  foo: string;
};

describe('StorageService', () => {
  let service: StorageService<StorageItem>;
  let firestore: FirebaseFirestore.Firestore;
  let collectionName: string;

  beforeAll(() => {
    firestore = getFirestore();
    collectionName = `storage-${randomUUID()}`;

    service = getStorageService(collectionName, { firestore });
  });

  afterEach(async () => {
    await deleteCollection(firestore, collectionName);
  });

  test('should return item if it is presented in the storage', async () => {
    // Arrange
    await insertIntoCollection<StorageItem>(firestore, collectionName, {
      id: '42',
      data: {
        foo: 'bar',
      },
    });

    // Act
    const item = await service.get('42');

    // Assert
    expect(item).toBeDefined();

    expect(item?.foo).toBe('bar');
  });

  test('should return null if item is not presented in the storage', async () => {
    // Act
    const item = await service.get('42');

    // Assert
    expect(item).toBeNull();
  });

  test('should save item to cathe storageche', async () => {
    // Act
    await service.set('42', { foo: 'bar bar' });

    // Assert
    const items = await getFromCollection<StorageItem>(
      firestore,
      collectionName,
    );

    expect(items).toHaveLength(1);

    expect(items[0]).toBeDefined();
    expect(items[0]?.foo).toBe('bar bar');
  });
});
