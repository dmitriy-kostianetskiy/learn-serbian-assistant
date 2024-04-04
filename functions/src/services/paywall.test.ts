import { getPaywall } from './paywall';
import { UpdateUserInput, User, UserRepository } from './userRepository';

describe('paywall', () => {
  test('should not throw if daily quota is exceeded and should increase daily quota usage', async () => {
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
    await paywall.pass(userId);

    // Assert
    const expectedUpdate: UpdateUserInput = { dailyQuotaUsed: 1 };
    expect(userRepository.update).toHaveBeenCalledWith(userId, expectedUpdate);
  });

  test('should throw if daily quota is exceeded', async () => {
    // Arrange
    const userId = '123';
    const user: User = {
      dailyQuotaUsed: 10,
      hasPremium: false,
    };

    const userRepository: UserRepository = {
      add: jest.fn(),
      get: jest.fn(async () => user),
      update: jest.fn(),
      updateAll: jest.fn(),
    };

    const paywall = getPaywall(userRepository, 10);

    // Act & Assert
    expect(async () => await paywall.pass(userId)).rejects.toThrow(
      'You have exceeded daily usage limit. Please try again tomorrow.',
    );
  });

  test('should not throw if daily quota is exceeded but the user has premium and should increase daily quota usage', async () => {
    // Arrange
    const userId = '123';
    const user: User = {
      dailyQuotaUsed: 10,
      hasPremium: true,
    };

    const userRepository: UserRepository = {
      add: jest.fn(),
      get: jest.fn(async () => user),
      update: jest.fn(),
      updateAll: jest.fn(),
    };

    const paywall = getPaywall(userRepository, 10);

    // Act
    await paywall.pass(userId);

    // Assert
    const expectedUpdate: UpdateUserInput = { dailyQuotaUsed: 11 };

    expect(userRepository.update).toHaveBeenCalledWith(userId, expectedUpdate);
  });
});
