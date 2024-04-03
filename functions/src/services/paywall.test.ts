import { getPaywall } from './paywall';
import { UpdateUserInput, User, UserRepository } from './userRepository';

describe('paywall', () => {
  test('should let if limit is not exceeded', async () => {
    // Arrange
    const userId = '123';
    const user: User = {
      dailyQuotaUsed: 0,
      hasPremium: false,
    };

    const userRepository: UserRepository = {
      add: jest.fn(),
      get: jest.fn(async () => user),
      update: jest.fn(),
      updateAll: jest.fn(),
    };

    const paywall = getPaywall(userRepository);

    // Act
    const result = await paywall.try(userId);

    // Assert
    expect(result).toBeTruthy();

    const expectedUpdate: UpdateUserInput = { dailyQuotaUsed: 1 };
    expect(userRepository.update).toHaveBeenCalledWith(userId, expectedUpdate);
  });

  test('should not let if limit is exceeded', async () => {
    // Arrange
    const userId = '123';
    const user: User = {
      dailyQuotaUsed: 100,
      hasPremium: false,
    };

    const userRepository: UserRepository = {
      add: jest.fn(),
      get: jest.fn(async () => user),
      update: jest.fn(),
      updateAll: jest.fn(),
    };

    const paywall = getPaywall(userRepository);

    // Act
    const result = await paywall.try(userId);

    // Assert
    expect(result).toBeFalsy();
  });

  test('should let if limit is exceeded and has premium', async () => {
    // Arrange
    const userId = '123';
    const user: User = {
      dailyQuotaUsed: 100,
      hasPremium: true,
    };

    const userRepository: UserRepository = {
      add: jest.fn(),
      get: jest.fn(async () => user),
      update: jest.fn(),
      updateAll: jest.fn(),
    };

    const paywall = getPaywall(userRepository);

    // Act
    const result = await paywall.try(userId);

    // Assert
    expect(result).toBeTruthy();

    const expectedUpdate: UpdateUserInput = { dailyQuotaUsed: 101 };
    expect(userRepository.update).toHaveBeenCalledWith(userId, expectedUpdate);
  });
});
