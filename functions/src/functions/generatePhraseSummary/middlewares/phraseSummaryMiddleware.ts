import { CacheService } from '../../../services/cacheService';
import { printPhraseSummary } from '../../../services/printWordData/printWordData';
import { GenericMiddleware } from '../../../utils/genericMiddleware';
import { replyToMessageWithHtml } from '../../../utils/replyToMessageWithHtml';
import { Context } from './context';

export const phraseSummaryMiddleware: GenericMiddleware<Context> = async (
  {
    dependencies: { telegram, phraseSummaryService, phraseSummaryCache },
    payload: { messageId, chatId, text },
  },
  next,
) => {
  const phraseSummary = await getFromCacheOrCreate(
    text,
    phraseSummaryCache,
    async (key) => {
      return await phraseSummaryService.generate(key);
    },
  );

  const phraseSummaryString = printPhraseSummary(phraseSummary);

  await replyToMessageWithHtml(telegram)(phraseSummaryString, {
    messageId,
    chatId,
  });

  await next();
};

const getFromCacheOrCreate = async <T extends object>(
  key: string,
  cache: CacheService<T>,
  factory: (key: string) => Promise<T>,
): Promise<T> => {
  const cachedData = await cache.get(key);

  if (cachedData) {
    return cachedData;
  }

  const data = await factory(key);

  await cache.set(key, data);

  return data;
};
