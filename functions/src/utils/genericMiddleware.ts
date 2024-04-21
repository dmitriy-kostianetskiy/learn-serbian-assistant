export type GenericMiddleware<TContext> = (
  context: TContext,
  next: () => Promise<void>,
) => Promise<void> | void;

export const compose = <TContext>(
  ...middlewares: GenericMiddleware<TContext>[]
) => {
  return async (context: TContext) => {
    let previousIndex = -1;

    const runner = async (index: number) => {
      if (index === previousIndex) {
        throw new Error('next() called multiple times');
      }

      previousIndex = index;

      const middleware = middlewares[index];

      if (middleware) {
        await middleware(context, async () => {
          await runner(index + 1);
        });
      }
    };

    await runner(0);
  };
};
