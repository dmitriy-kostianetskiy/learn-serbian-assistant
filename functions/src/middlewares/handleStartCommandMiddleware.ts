import { Context } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';
import { Dependencies } from '../dependencies';

export const handleStartCommandMiddleware =
  ({ configService: config }: Dependencies) =>
  async (context: Context<Update.MessageUpdate<Message.TextMessage>>) => {
    const welcomeMessage = await config.get('welcomeMessage');

    await context.reply(welcomeMessage);
  };
