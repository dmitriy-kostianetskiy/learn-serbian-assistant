import { Context } from 'telegraf';
import { Message } from '../../../consts/message';

export const handleStartCommandMiddleware = async (context: Context) => {
  await context.reply(Message.WelcomeMessage);
};
