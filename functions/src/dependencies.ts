import { getFirestore } from './apis/firestore';
import { Telegraf, Telegram } from 'telegraf';
import { Ai, createAi } from './services/ai';
import { UserService, getUserService } from './services/userService';
import { getRemoteConfig } from 'firebase-admin/remote-config';
import { ConfigService, getConfigService } from './services/configService';
import { SummaryService, getSummaryService } from './services/summaryService';
import { PubSub } from '@google-cloud/pubsub';
import {
  SummaryQueueService,
  getSummaryQueueService,
} from './services/summaryQueueService';
import { Summary } from './model/summary';
import { StorageService, getStorageService } from './services/storageService';
import { EventService, getEventsService } from './services/eventsService';
import {
  createPromptBuilderService,
  PromptBuilderService,
} from './services/prompt-builder';

export type GetDependenciesOptions = {
  telegramBotToken: string;
  openAiKey: string;
  summaryPromptName?: string;
};

export interface Dependencies {
  telegraf: Telegraf;
  telegram: Telegram;
  userService: UserService;
  configService: ConfigService;
  ai: Ai;
  summaryService: SummaryService;
  summaryStorage: StorageService<Summary>;
  eventsService: EventService;
  summaryQueueService: SummaryQueueService;
  promptBuilderService: PromptBuilderService;
}

let dependencies: Dependencies | undefined;

export const getDependencies = ({
  openAiKey,
  telegramBotToken,
  summaryPromptName,
}: GetDependenciesOptions): Dependencies => {
  if (dependencies) {
    return dependencies;
  }

  const firestore = getFirestore();
  const remoteConfig = getRemoteConfig();

  const configService = getConfigService(remoteConfig);

  const telegraf = new Telegraf(telegramBotToken);

  const userService = getUserService({ firestore });

  const ai = createAi({
    apiKey: openAiKey,
  });

  const promptBuilderService = createPromptBuilderService({
    configService,
  });

  const summaryService = getSummaryService({
    ai,
    promptBuilderService,
    promptName: summaryPromptName ?? 'summary',
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
    configService,
    ai,
    summaryService,
    summaryStorage,
    eventsService,
    summaryQueueService,
    promptBuilderService,
  };

  return dependencies;
};

export const getTestDependencies = () =>
  getDependencies({
    openAiKey: process.env.OPEN_AI_KEY!,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!,
    summaryPromptName: process.env.SUMMARY_PROMPT_NAME!,
  });
