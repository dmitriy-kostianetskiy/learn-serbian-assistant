import { getFirestore } from 'firebase-admin/firestore';
import { User, UserService, getUserService } from './userService';
import { v4 as uuid } from 'uuid';
import {
  deleteCollection,
  getFromCollection,
  insertIntoCollection,
} from '../../utils/firebaseUtils';

describe('UserService', () => {
  let service: UserService;
  let firestore: FirebaseFirestore.Firestore;
  let collectionName: string;

  beforeAll(() => {
    firestore = getFirestore();
    collectionName = `user-test-${uuid()}`;

    service = getUserService({ firestore }, collectionName);
  });

  afterEach(async () => {
    await deleteCollection(firestore, collectionName);
  });

  test('should set dailyQuotaUsed to 0 when resetAllDailyQuotaUsed called', async () => {
    // Arrange
    await insertIntoCollection<User>(
      firestore,
      collectionName,
      {
        id: '42',
        data: {
          dailyQuotaUsed: 100,
          hasPremium: false,
          userDetails: {},
        },
      },
      {
        id: '43',
        data: {
          dailyQuotaUsed: 101,
          hasPremium: true,
          userDetails: {},
        },
      },
    );

    // Act
    await service.resetAllDailyQuotaUsed();

    // Assert
    const users = await getFromCollection<User>(firestore, collectionName);

    expect(users).toHaveLength(2);

    expect(users[0].dailyQuotaUsed).toBe(0);
    expect(users[1].dailyQuotaUsed).toBe(0);
  });

  test('should create new user when getOrCreate called', async () => {
    // Arrange & Act
    const user = await service.getOrCreate(42, {
      username: 'joe.doe',
      firstName: 'Joe',
      lastName: 'Doe',
    });

    // Assert
    expect(user).toMatchObject<User>({
      dailyQuotaUsed: 0,
      hasPremium: false,
      userDetails: {
        username: 'joe.doe',
        firstName: 'Joe',
        lastName: 'Doe',
      },
    });
  });

  test('should get user when getOrCreate called', async () => {
    // Arrange
    await insertIntoCollection<User>(firestore, collectionName, {
      id: '42',
      data: {
        dailyQuotaUsed: 100,
        hasPremium: true,
        userDetails: {},
      },
    });

    // Act
    const user = await service.getOrCreate(42, {
      username: 'joe.doe',
      firstName: 'Joe',
      lastName: 'Doe',
    });

    // Assert
    expect(user).toMatchObject<User>({
      dailyQuotaUsed: 100,
      hasPremium: true,
      userDetails: {
        username: 'joe.doe',
        firstName: 'Joe',
        lastName: 'Doe',
      },
    });
  });

  test('should increment dailyQuotaUsed when incrementDailyQuotaUsed called', async () => {
    // Arrange
    await insertIntoCollection<User>(firestore, collectionName, {
      id: '42',
      data: {
        dailyQuotaUsed: 100,
        hasPremium: true,
        userDetails: {},
      },
    });

    // Act
    await service.incrementDailyQuotaUsed(42);

    // Assert
    const users = await getFromCollection<User>(firestore, collectionName);

    expect(users).toHaveLength(1);
    expect(users[0].dailyQuotaUsed).toBe(101);
  });

  test('should create new user and increment dailyQuotaUsed when incrementDailyQuotaUsed called', async () => {
    // Arrange & Act
    await service.incrementDailyQuotaUsed(42);

    // Assert
    const users = await getFromCollection<User>(firestore, collectionName);

    expect(users).toHaveLength(1);
    expect(users[0].dailyQuotaUsed).toBe(1);
  });
});
