import { Context } from 'telegraf';
import { Dependencies } from '../dependencies';
import { replyToMessage } from '../utils/replyToMessage';
import { printPhraseSummary } from '../services/printWordData/printWordData';

export type GeneratePhraseSummaryMiddlewareDependencies = Pick<
  Dependencies,
  'phraseSummaryService'
>;

export const generatePhraseSummaryMiddleware =
  ({ phraseSummaryService }: GeneratePhraseSummaryMiddlewareDependencies) =>
  async (context: Context) => {
    const phrase = context.text;
    const messageId = context.message?.message_id;

    if (!phrase || !messageId) {
      return;
    }

    const phraseSummary = await phraseSummaryService.generate(phrase);

    const phraseSummaryString = printPhraseSummary(phraseSummary);

    await replyToMessage(context)(phraseSummaryString, messageId);
  };
