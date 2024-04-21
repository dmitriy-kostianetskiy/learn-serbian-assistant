import { Context, Telegram } from 'telegraf';
import { ReplyParameters } from 'telegraf/typings/core/types/typegram';

export const replyToMessage =
  (context: Context) => async (message: string, messageId?: number) => {
    const replyParameters: ReplyParameters | undefined = messageId
      ? {
          message_id: messageId,
        }
      : undefined;

    await context.reply(message, {
      parse_mode: 'HTML',
      reply_parameters: replyParameters,
    });
  };

export const replyToMessageWithHtml =
  (telegram: Telegram) =>
  async (
    message: string,
    {
      chatId,
      messageId,
    }: {
      chatId: string | number;
      messageId?: number;
    },
  ) => {
    const replyParameters: ReplyParameters | undefined = messageId
      ? {
          message_id: messageId,
        }
      : undefined;

    await telegram.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      reply_parameters: replyParameters,
    });
  };
