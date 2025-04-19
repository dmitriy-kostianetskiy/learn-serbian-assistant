import { getFirestore } from './apis/firestore';
import { Telegraf, Telegram } from 'telegraf';
import { Ai, createAi } from './services/ai';
import { UserService, getUserService } from './services/user-service';
import {
  SummaryService,
  createSummaryService,
} from './services/summary-service';
import { PubSub } from '@google-cloud/pubsub';
import {
  SummaryQueueService,
  getSummaryQueueService,
} from './services/summary-queue-service';
import { Summary } from './model/summary';
import { StorageService, getStorageService } from './services/storage-service';
import { EventService, getEventsService } from './services/events-service';
import { getServerConfig } from './utils/server-config';
import { ServerConfig } from './model/server-config';

export type GetDependenciesOptions = {
  telegramBotToken: string;
  openAiKey: string;
};

export interface Dependencies {
  telegraf: Telegraf;
  telegram: Telegram;
  userService: UserService;
  ai: Ai;
  summaryService: SummaryService;
  summaryStorage: StorageService<Summary>;
  eventsService: EventService;
  summaryQueueService: SummaryQueueService;
  serverConfig: ServerConfig;
}

let dependencies: Dependencies | undefined;

export const getDependencies = async ({
  openAiKey,
  telegramBotToken,
}: GetDependenciesOptions): Promise<Dependencies> => {
  if (dependencies) {
    return dependencies;
  }

  const firestore = getFirestore();
  const serverConfig = await getServerConfig();

  const telegraf = new Telegraf(telegramBotToken);

  const userService = getUserService({ firestore });

  const ai = createAi({
    apiKey: openAiKey,
  });

  const summaryService = createSummaryService({
    ai,
    serverConfig,
  });

  const summaryStorage = getStorageService<Summary>('summaries', {
    firestore,
  });

  const eventsService = getEventsService({ firestore });

  const pubSub = new PubSub({
    projectId: 'learn-serbian-assistant',
  });

  const summaryQueueService = getSummaryQueueService({ pubSub });

  dependencies = {
    telegraf,
    telegram: telegraf.telegram,
    userService,
    ai,
    summaryService,
    summaryStorage,
    eventsService,
    summaryQueueService,
    serverConfig,
  };

  return dependencies;
};

export const getTestDependencies = () =>
  getDependencies({
    openAiKey: process.env.OPEN_AI_KEY!,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!,
  });
