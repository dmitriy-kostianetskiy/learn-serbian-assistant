import { Telegram } from 'telegraf';
import { ConfigService } from '../../../services/configService';
import { User, UserService } from '../../../services/userService/userService';
import { paywallMiddleware } from './paywallMiddleware';

type Context = Parameters<typeof paywallMiddleware>[0];

describe('paywallMiddleware', () => {
  const createUserService = (user: User): UserService => ({
    getOrCreate: jest.fn(async () => user),
    incrementDailyQuotaUsed: jest.fn(),
    resetAllDailyQuotaUsed: jest.fn(),
  });

  const createConfigService = (quota: number): ConfigService =>
    ({
      get: jest.fn(async () => quota),
    }) as ConfigService;

  const createContext = (user: User, quota = 10): Context => {
    const userService = createUserService(user);
    const configService = createConfigService(quota);
    const telegram = {
      sendMessage: jest.fn(),
    } as unknown as Telegram;

    return {
      dependencies: {
        configService,
        userService,
        telegram,
      },
      payload: {
        userId: 0,
        chatId: 0,
        messageId: 0,
        userDetails: {},
      },
    };
  };

  test('should pass if daily quota is not exceeded', async () => {
    // Arrange
    const quota = 10;
    const user: User = {
      dailyQuotaUsed: 0,
      hasPremium: false,
      userDetails: {},
    };

    const context = createContext(user, quota);
    const next = jest.fn();

    // Act
    await paywallMiddleware(context, next);

    // Assert
    expect(next).toHaveBeenCalled();
  });

  test('should not pass if daily quota is exceeded', async () => {
    // Arrange
    const quota = 10;
    const user: User = {
      dailyQuotaUsed: 10,
      hasPremium: false,
      userDetails: {},
    };

    const context = createContext(user, quota);
    const next = jest.fn();

    // Act
    await paywallMiddleware(context, next);

    // Assert
    expect(next).not.toHaveBeenCalled();
  });

  test('should pass if daily quota is exceeded but user has premium', async () => {
    // Arrange
    const quota = 10;
    const user: User = {
      dailyQuotaUsed: 10,
      hasPremium: true,
      userDetails: {},
    };

    const context = createContext(user, quota);
    const next = jest.fn();

    // Act
    await paywallMiddleware(context, next);

    // Assert
    expect(next).toHaveBeenCalled();
  });
});
