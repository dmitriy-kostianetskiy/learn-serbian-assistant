import { Telegraf } from 'telegraf';

type ErrorMiddleware = Parameters<(typeof Telegraf)['catch']>[0];

export const errorMiddleware: ErrorMiddleware = async (error, context) => {
  console.error(error);

  await context.reply('Oops! Something went wrong.');
};
