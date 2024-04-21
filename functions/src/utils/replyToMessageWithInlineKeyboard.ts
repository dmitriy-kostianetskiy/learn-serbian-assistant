import { Telegram } from 'telegraf';
import {
  InlineKeyboardButton,
  ReplyParameters,
} from 'telegraf/typings/core/types/typegram';

export const replyToMessageWithInlineKeyboard =
  (telegram: Telegram) =>
  async (
    buttons: string[],
    {
      message,
      chatId,
      messageId,
    }: {
      message: string;
      chatId: string | number;
      messageId?: number;
    },
  ): Promise<void> => {
    const replyParameters: ReplyParameters | undefined = messageId
      ? {
          message_id: messageId,
        }
      : undefined;

    await telegram.sendMessage(chatId, message, {
      reply_parameters: replyParameters,
      reply_markup: {
        inline_keyboard: generateInlineKeyboard(buttons),
      },
    });
  };

const generateInlineKeyboard = (
  suggestions: string[],
): InlineKeyboardButton[][] => {
  return suggestions.map((item, index): InlineKeyboardButton[] => [
    {
      text: item,
      callback_data: `option-${index.toFixed(0)}`,
    },
  ]);
};
