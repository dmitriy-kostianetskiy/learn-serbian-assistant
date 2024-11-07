import { replyToMessageWithInlineKeyboard } from '../../../utils/replyToMessageWithInlineKeyboard';
import { replyToMessageWithHtml } from '../../../utils/replyToMessageWithHtml';
import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { Context } from './context';
import { Message } from '../../../consts/message';

export const suggestionsMiddleware: GenericMiddleware<Context> = async (
  {
    dependencies: { suggestionService, telegram, eventsService },
    payload,
  },
  next,
) => {
  const { text, messageId, chatId, userId } = payload;

  console.log(`User '${userId}': suggestions for '${text}' for requested.`);

  const suggestions = await suggestionService.generate(text);

  console.log(`'${text}': suggestions for user '${userId}' generated.`, suggestions);

  // if it is serbian phrase proceed
  if (suggestions.language === 'serbian') {
    return await next();
  }

  // if it is not serbian phrase and suggestion presented show inline keyboard
  if (suggestions.language !== 'serbian' && suggestions.suggestions?.length) {
    await eventsService.add({
      type: 'phrase-is-not-serbian',
      payload,
      suggestions
    });

    return await replyToMessageWithInlineKeyboard(telegram)(
      suggestions.suggestions,
      {
        message: Message.PhraseIsNotInSerbian,
        chatId,
        messageId,
      },
    );
  }

  await eventsService.add({
    type: 'phrase-is-unknown',
    payload
  });

  // otherwise fail
  return await replyToMessageWithHtml(telegram)(
    Message.PhraseCanNotBeInterpret,
    {
      chatId,
      messageId,
    },
  );
};
