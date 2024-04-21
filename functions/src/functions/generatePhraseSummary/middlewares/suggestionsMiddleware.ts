import { replyToMessageWithInlineKeyboard } from '../../../utils/replyToMessageWithInlineKeyboard';
import { replyToMessageWithHtml } from '../../../utils/replyToMessageWithHtml';
import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { Context } from './context';
import { Message } from '../../../consts/message';

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
        message: Message.PhraseIsNotInSerbian,
        chatId,
        messageId,
      },
    );
  }

  // otherwise fail
  return await replyToMessageWithHtml(telegram)(
    Message.PhraseCanNotBeInterpret,
    {
      chatId,
      messageId,
    },
  );
};
