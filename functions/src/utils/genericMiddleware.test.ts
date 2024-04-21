import { GenericMiddleware, compose } from './genericMiddleware';

type TestMiddleware = GenericMiddleware<void>;

const createTestMiddleware = (middleware: TestMiddleware) => {
  return jest.fn<ReturnType<TestMiddleware>, Parameters<TestMiddleware>>(
    middleware,
  );
};

describe('genericMiddleware', () => {
  test('should call middleware exactly one time', async () => {
    // Arrange
    const testMiddleware = createTestMiddleware(async (_context, next) => {
      await next();
    });

    const composed = compose(testMiddleware);

    // Act
    await composed();

    // Assert
    expect(testMiddleware).toHaveBeenCalledTimes(1);
  });

  test('should call all middlewares exactly one time', async () => {
    // Arrange
    const firstTestMiddleware = createTestMiddleware(async (_context, next) => {
      await next();
    });

    const secondTestMiddleware = createTestMiddleware(
      async (_context, next) => {
        await next();
      },
    );

    const composed = compose(firstTestMiddleware, secondTestMiddleware);

    // Act
    await composed();

    // Assert
    expect(firstTestMiddleware).toHaveBeenCalledTimes(1);
    expect(secondTestMiddleware).toHaveBeenCalledTimes(1);
  });

  test('should not call second middleware when next has not been called', async () => {
    // Arrange
    const firstTestMiddleware = createTestMiddleware(async () => {});

    const secondTestMiddleware = createTestMiddleware(
      async (_context, next) => {
        await next();
      },
    );

    const composed = compose(firstTestMiddleware, secondTestMiddleware);

    // Act
    await composed();

    // Assert
    expect(firstTestMiddleware).toHaveBeenCalledTimes(1);
    expect(secondTestMiddleware).not.toHaveBeenCalled();
  });

  test('should throw error if next() called twice', async () => {
    // Arrange
    const testMiddleware = createTestMiddleware(async (_context, next) => {
      await next();
      await next();
    });

    const composed = compose(testMiddleware);

    // Act & Assert
    expect(async () => {
      await composed();
    }).rejects.toThrow();
  });

  test('should throw error if middleware throws', async () => {
    // Arrange
    const testMiddleware = createTestMiddleware(async () => {
      throw new Error('Failure!');
    });

    const composed = compose(testMiddleware);

    // Act & Assert
    expect(async () => {
      await composed();
    }).rejects.toThrow();
  });
});
