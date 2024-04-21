import { Telegraf } from 'telegraf';
import { Message } from '../../../consts/message';

type ErrorMiddleware = Parameters<(typeof Telegraf)['catch']>[0];

export const errorMiddleware: ErrorMiddleware = async (error, context) => {
  console.error(error);

  await context.reply(Message.ErrorMessage);
};
