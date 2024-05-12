import { getFirestore } from 'firebase-admin/firestore';
import { v4 as uuid } from 'uuid';
import {
  deleteCollection,
  getFromCollection,
  insertIntoCollection,
} from '../../utils/firebaseUtils';
import { CacheService } from './cacheService.model';
import { getCacheService } from './cacheService';

type CacheItem = {
  foo: string;
}

describe('CacheService', () => {
  let service: CacheService<CacheItem>;
  let firestore: FirebaseFirestore.Firestore;
  let collectionName: string;

  beforeAll(() => {
    firestore = getFirestore();
    collectionName = `cache-${uuid()}`;

    service = getCacheService(collectionName, { firestore });
  });

  afterEach(async () => {
    await deleteCollection(firestore, collectionName);
  });

  test('should return item if it is presented in cache', async () => {
    // Arrange
    await insertIntoCollection<CacheItem>(
      firestore,
      collectionName,
      {
        id: '42',
        data: {
          foo: 'bar'
        },
      },
    );

    // Act
    const item = await service.get('42');

    // Assert
    expect(item).toBeDefined();

    expect(item?.foo).toBe('bar');
  });

  test('should return null if item is not presented in cache', async () => {
    // Act
    const item = await service.get('42');

    // Assert
    expect(item).toBeNull();
  });


  test('should save item to cache', async () => {
    // Act
    await service.set('42', { foo: 'bar bar' });

    // Assert
    const itemsFromCache = await getFromCollection<CacheItem>(firestore, collectionName);

    expect(itemsFromCache).toHaveLength(1);

    expect(itemsFromCache[0]).toBeDefined();
    expect(itemsFromCache[0]?.foo).toBe('bar bar');
  });
});
