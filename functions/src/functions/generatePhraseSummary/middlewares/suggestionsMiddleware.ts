import { replyToMessageWithInlineKeyboard } from '../../../utils/replyToMessageWithInlineKeyboard';
import { replyToMessageWithHtml } from '../../../utils/replyToMessageWithHtml';
import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { Context } from './context';

export const suggestionsMiddleware: GenericMiddleware<Context> = async (
  {
    dependencies: { suggestionService, telegram },
    payload: { text, messageId, chatId },
  },
  next,
) => {
  const suggestions = await suggestionService.generate(text);

  // if it is not serbian phrase proceed
  if (suggestions.language === 'serbian') {
    return await next();
  }

  // if it is not serbian phrase and suggestion presented show inline keyboard
  if (suggestions.language !== 'serbian' && suggestions.suggestions?.length) {
    return await replyToMessageWithInlineKeyboard(telegram)(
      suggestions.suggestions,
      {
        message:
          'Seems like it is not in Serbian, please consider the following translations:',
        chatId,
        messageId,
      },
    );
  }

  // otherwise fail
  return await replyToMessageWithHtml(telegram)(
    'Sorry, I can not understand this. Can you please rephrase?',
    {
      chatId,
      messageId,
    },
  );
};
