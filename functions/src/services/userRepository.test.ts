import {
  CollectionReference,
  DocumentData,
  Firestore,
} from 'firebase-admin/firestore';
import { getFirestore } from '../apis/firestore';
import { v4 as uuid } from 'uuid';
import {
  AddUserInput,
  User,
  UserRepository,
  getUserRepository,
} from './userRepository';
import { deleteCollection } from '../utils/deleteCollection';

describe('user repository', () => {
  let firestore: Firestore;
  let repository: UserRepository;
  let collection: CollectionReference<DocumentData>;

  beforeAll(async () => {
    firestore = getFirestore();
  });

  beforeEach(async () => {
    // create collection with random name for testing
    const testCollection = `user-test-${uuid()}`;
    collection = firestore.collection(testCollection);

    // create repository
    repository = getUserRepository(firestore, testCollection);
  });

  afterEach(async () => {
    await deleteCollection(collection);
  });

  test('should add user', async () => {
    // Arrange
    const userId = '123456';
    const user: AddUserInput = {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john.doe',
    };

    // Act
    await repository.add(userId, user);

    // Assert
    const userInDb = await collection.doc(userId).get();

    expect(userInDb.exists).toBeTruthy();

    const expectedUser: User = {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john.doe',
      dailyQuotaUsed: 0,
      hasPremium: false,
    };

    expect(userInDb.data()).toMatchObject(expectedUser);
  });

  test('should update user if it already exists', async () => {
    // Arrange
    const userId = '123456';
    const user: AddUserInput = {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john.doe',
    };

    const existingUser: User = {
      firstName: 'James',
      lastName: 'Smith',
      userName: 'james.smith',
      dailyQuotaUsed: 10,
      hasPremium: true,
    };

    await collection.doc(userId).set(existingUser);

    // Act
    await repository.add(userId, user);

    // Assert
    const userInDb = await collection.doc(userId).get();

    expect(userInDb.exists).toBeTruthy();

    const expectedUser: User = {
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john.doe',
      dailyQuotaUsed: 10,
      hasPremium: true,
    };

    expect(userInDb.data()).toMatchObject(expectedUser);
  });

  test('should get user if it already exists', async () => {
    // Arrange
    const userId = '123456';

    const existingUser: User = {
      firstName: 'James',
      lastName: 'Smith',
      userName: 'james.smith',
      dailyQuotaUsed: 10,
      hasPremium: true,
    };

    await collection.doc(userId).set(existingUser);

    // Act
    const user = await repository.get(userId);

    // Assert
    expect(user).toMatchObject(existingUser);
  });

  test('should get undefined if user does not exists', async () => {
    // Arrange
    const userId = '123456';

    // Act
    const user = await repository.get(userId);

    // Assert
    expect(user).toBeUndefined();
  });

  test('should update user', async () => {
    // Arrange
    const userId = '123456';

    const existingUser: User = {
      firstName: 'James',
      lastName: 'Smith',
      userName: 'james.smith',
      dailyQuotaUsed: 10,
      hasPremium: true,
    };

    await collection.doc(userId).set(existingUser);

    // Act
    await repository.update(userId, { hasPremium: false, dailyQuotaUsed: 11 });

    // Assert
    const userInDbSnapshot = await collection.doc(userId).get();

    expect(userInDbSnapshot.exists).toBeTruthy();

    const userInDb = userInDbSnapshot.data();

    expect(userInDb?.hasPremium).toBeFalsy();
    expect(userInDb?.dailyQuotaUsed).toBe(11);
  });

  test('should update all users', async () => {
    // Arrange
    await collection.doc('123').set({
      firstName: 'James',
      lastName: 'Smith',
      userName: 'james.smith',
      dailyQuotaUsed: 3,
      hasPremium: true,
    });

    await collection.doc('456').set({
      firstName: 'John',
      lastName: 'Doe',
      userName: 'john.doe',
      dailyQuotaUsed: 2,
      hasPremium: false,
    });

    // Act
    await repository.updateAll({ dailyQuotaUsed: 0 });

    // Assert
    const all = await collection.get();

    all.docs.forEach((snapshot) => {
      const user = snapshot.data() as User;

      expect(user.dailyQuotaUsed).toBe(0);
    });
  });
});
