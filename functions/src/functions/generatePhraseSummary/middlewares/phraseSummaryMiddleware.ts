import { printPhraseSummary } from '../../../services/printWordData/printWordData';
import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { replyToMessageWithHtml } from '../../../utils/replyToMessageWithHtml';
import { Context } from './context';

export const phraseSummaryMiddleware: GenericMiddleware<Context> = async (
  {
    dependencies: { telegram, phraseSummaryService },
    payload: { messageId, chatId, text },
  },
  next,
) => {
  const phraseSummary = await phraseSummaryService.generate(text);

  const phraseSummaryString = printPhraseSummary(phraseSummary);

  await replyToMessageWithHtml(telegram)(phraseSummaryString, {
    messageId,
    chatId,
  });

  await next();
};
