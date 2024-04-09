import { Context } from 'telegraf';
import { Dependencies } from '../dependencies';
import { replyToMessage } from '../utils/replyToMessage';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

type GenerateSuggestionsMiddlewareDependencies = Pick<
  Dependencies,
  'suggestionService'
>;

export const generateSuggestionsMiddleware =
  ({ suggestionService }: GenerateSuggestionsMiddlewareDependencies) =>
  async (context: Context, next: () => Promise<void>) => {
    const phrase = context.text;
    const messageId = context.message?.message_id;

    if (!phrase || !messageId) {
      return;
    }

    const suggestions = await suggestionService.generate(phrase);

    // if it is not serbian phrase proceed
    if (suggestions.language === 'serbian') {
      return await next();
    }

    // if it is not serbian phrase and suggestion presented show inline keyboard
    if (suggestions.language !== 'serbian' && suggestions.suggestions?.length) {
      return await replyWithInlineKeyboard(
        context,
        messageId,
        suggestions.suggestions,
      );
    }

    // otherwise fail
    await replyToMessage(context)(
      'Sorry, I can not understand this. Can you please rephrase?',
      messageId,
    );
  };

const replyWithInlineKeyboard = async (
  context: Context,
  messageId: number,
  suggestions: string[],
) => {
  await context.reply(
    'Seems like it is not in Serbian, please consider the following translations:',
    {
      reply_parameters: {
        message_id: messageId,
      },
      reply_markup: {
        inline_keyboard: generateInlineKeyboard(suggestions),
      },
    },
  );
};

const generateInlineKeyboard = (suggestions: string[]) => {
  return suggestions.map((item, index): InlineKeyboardButton[] => [
    {
      text: item,
      callback_data: `suggestion-${index.toFixed()}`,
    },
  ]);
};
