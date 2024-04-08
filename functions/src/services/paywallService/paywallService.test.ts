import { getPaywallService } from './paywallService';
import { UpdateUserInput, User, UserRepository } from '../userRepository';
import { TryPassResult } from './paywallService.model';
import { ConfigService } from '../configService';

describe('PaywallService', () => {
  const createUserRepository = (user?: User): UserRepository => ({
    add: jest.fn(),
    get: jest.fn(async () => user),
    update: jest.fn(),
    updateAll: jest.fn(),
  });

  const createConfigService = (quota = 10): ConfigService =>
    ({
      get: jest.fn(async () => quota),
    }) as ConfigService;

  test('should pass if daily quota is exceeded and should increase daily quota usage', async () => {
    // Arrange
    const userId = '123';
    const user: User = {
      dailyQuotaUsed: 0,
      hasPremium: false,
    };

    const userRepository = createUserRepository(user);
    const configService = createConfigService();

    const paywall = getPaywallService({ userRepository, configService });

    // Act
    const result = await paywall.tryPass(userId);

    // Assert
    expect(result).toMatchObject<TryPassResult>({
      passed: true,
    });

    expect(userRepository.update).toHaveBeenCalledWith<
      [string, UpdateUserInput]
    >(userId, { dailyQuotaUsed: 1 });
  });

  test('should not pass if daily quota is exceeded', async () => {
    // Arrange
    const userId = '123';
    const user: User = {
      dailyQuotaUsed: 10,
      hasPremium: false,
    };

    const userRepository = createUserRepository(user);
    const configService = createConfigService();

    const paywall = getPaywallService({ userRepository, configService });

    // Act
    const result = await paywall.tryPass(userId);

    // Assert
    expect(result).toMatchObject<TryPassResult>({
      passed: false,
      message:
        'You have exceeded daily usage limit. Please try again tomorrow.',
    });
  });

  test('should pass if daily quota is exceeded but the user has premium and should increase daily quota usage', async () => {
    // Arrange
    const userId = '123';
    const user: User = {
      dailyQuotaUsed: 10,
      hasPremium: true,
    };

    const userRepository = createUserRepository(user);
    const configService = createConfigService();

    const paywall = getPaywallService({ userRepository, configService });

    // Act
    const result = await paywall.tryPass(userId);

    // Assert
    expect(result).toMatchObject<TryPassResult>({
      passed: true,
    });

    expect(userRepository.update).toHaveBeenCalledWith<
      [string, UpdateUserInput]
    >(userId, { dailyQuotaUsed: 11 });
  });

  test('should reset quota usage', async () => {
    // Arrange
    const userRepository = createUserRepository();
    const configService = createConfigService();

    const paywall = getPaywallService({ userRepository, configService });

    // Act
    await paywall.reset();

    // Assert
    expect(userRepository.updateAll).toHaveBeenCalledWith<[UpdateUserInput]>({
      dailyQuotaUsed: 0,
    });
  });
});
