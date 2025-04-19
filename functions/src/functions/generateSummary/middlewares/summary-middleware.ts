import { StorageService } from '../../../services/storage-service';
import { printSummary } from '../../../services/print-summary';
import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { replyToMessageWithHtml } from '../../../utils/replyToMessageWithHtml';
import { Context } from './context';
import { groupSections } from '../../../utils/string';

const MAX_TELEGRAM_MESSAGE_SIZE = 4096;
const DELIMITER = '\n\n';

export const summaryMiddleware: GenericMiddleware<Context> = async (
  {
    dependencies: { telegram, summaryService, summaryStorage, eventsService },
    payload,
  },
  next,
) => {
  const { messageId, chatId, text } = payload;

  const { data: summary, takenFromCache } = await getFromStorageOrCreate(
    text,
    summaryStorage,
    async (key) => {
      return await summaryService.generate(key);
    },
  );

  const summarySections = printSummary(summary).split(DELIMITER);

  await eventsService.add({
    type: 'summary-generated',
    payload,
    summary,
    takenFromCache,
  });

  const messages = groupSections(
    summarySections,
    MAX_TELEGRAM_MESSAGE_SIZE,
    DELIMITER,
  );

  for (const message of messages) {
    await replyToMessageWithHtml(telegram)(message, {
      messageId,
      chatId,
    });
  }

  await next();
};

const getFromStorageOrCreate = async <T extends object>(
  key: string,
  storage: StorageService<T>,
  factory: (key: string) => Promise<T>,
): Promise<{ data: T; takenFromCache: boolean }> => {
  const storageData = await storage.get(key);

  if (storageData) {
    return {
      data: storageData,
      takenFromCache: true,
    };
  }

  const data = await factory(key);

  await storage.set(key, data);

  return {
    data,
    takenFromCache: false,
  };
};
