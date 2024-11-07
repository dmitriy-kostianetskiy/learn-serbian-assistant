import { StorageService } from '../../../services/storageService';
import { printPhraseSummary } from '../../../services/printWordData/printWordData';
import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { replyToMessageWithHtml } from '../../../utils/replyToMessageWithHtml';
import { Context } from './context';

export const phraseSummaryMiddleware: GenericMiddleware<Context> = async (
  {
    dependencies: { telegram, phraseSummaryService, phraseSummaryStorage, eventsService },
    payload
  },
  next,
) => {
  const { messageId, chatId, text } = payload;

  const phraseSummary = await getFromStorageOrCreate(
    text,
    phraseSummaryStorage,
    async (key) => {
      return await phraseSummaryService.generate(key);
    },
  );

  const phraseSummaryString = printPhraseSummary(phraseSummary);

  await eventsService.add({
    type: 'phrase-summary-generated',
    payload,
    phraseSummary
  });

  await replyToMessageWithHtml(telegram)(phraseSummaryString, {
    messageId,
    chatId,
  });

  await next();
};

const getFromStorageOrCreate = async <T extends object>(
  key: string,
  storage: StorageService<T>,
  factory: (key: string) => Promise<T>,
): Promise<T> => {
  const storageData = await storage.get(key);

  if (storageData) {
    return storageData;
  }

  const data = await factory(key);

  await storage.set(key, data);

  return data;
};
