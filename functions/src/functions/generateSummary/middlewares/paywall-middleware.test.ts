import { Telegram } from 'telegraf';
import { UserService } from '../../../services/user-service';
import { paywallMiddleware } from './paywall-middleware';
import { Context } from './context';
import { User } from '../../../model/user';
import { EventService } from '../../../services/events-service';

describe('paywallMiddleware', () => {
  const createUserService = (user: User): UserService => ({
    getDailyQuotaUsed: jest.fn(async () => ({
      quotaUsed: user.dailyQuotaUsed ?? 0,
      hasPremium: user.hasPremium ?? false,
    })),
    updateUserDetails: jest.fn(),
    incrementDailyQuotaUsed: jest.fn(),
    resetAllDailyQuotaUsed: jest.fn(),
  });

  const createContext = (user: User, quota = 10): Context => {
    const userService = createUserService(user);
    const telegram = {
      sendMessage: jest.fn(),
    } as unknown as Telegram;

    const eventsService = {
      add: jest.fn(),
    } as unknown as EventService;

    return {
      dependencies: {
        eventsService,
        userService,
        telegram,
        serverConfig: {
          dailyQuota: quota,
        },
      },
      payload: {
        userId: 0,
        chatId: 0,
        messageId: 0,
        userDetails: {},
      },
    } as Context;
  };

  test('should pass if daily quota is not exceeded', async () => {
    // Arrange
    const quota = 10;
    const user: User = {
      userId: '42',
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
      userId: '42',
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
      userId: '42',
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
