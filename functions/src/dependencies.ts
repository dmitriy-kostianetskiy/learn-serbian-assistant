import OpenAI from 'openai';
import { getFirestore } from './apis/firestore';
import { Telegraf, Telegram } from 'telegraf';
import { OpenAiService, getOpenAiService } from './services/openAiService';
import {
  UserService,
  getUserService,
} from './services/userService/userService';
import { getRemoteConfig } from 'firebase-admin/remote-config';
import { ConfigService, getConfigService } from './services/configService';
import {
  PhraseSummaryService,
  getPhraseSummaryService,
} from './services/phraseSummaryService';
import {
  SuggestionService,
  getSuggestionService,
} from './services/suggestionService';
import { PubSub } from '@google-cloud/pubsub';
import {
  PhraseSummaryQueueService,
  getPhraseSummaryQueueService,
} from './services/phraseSummaryQueueService';
import { PhraseSummary, FailedItem } from './model/phraseSummary';
import { StorageService, getStorageService } from './services/storageService';

export type GetDependenciesOptions = {
  telegramBotToken: string;
  openAiKey: string;
};

export interface Dependencies {
  telegraf: Telegraf;
  telegram: Telegram;
  userService: UserService;
  configService: ConfigService;
  openAiService: OpenAiService;
  phraseSummaryService: PhraseSummaryService;
  phraseSummaryStorage: StorageService<PhraseSummary>;
  failuresStorage: StorageService<FailedItem>;
  suggestionService: SuggestionService;
  phraseSummaryQueueService: PhraseSummaryQueueService;
}

let dependencies: Dependencies | undefined;

export const getDependencies = ({
  openAiKey,
  telegramBotToken,
}: GetDependenciesOptions): Dependencies => {
  if (dependencies) {
    return dependencies;
  }

  const firestore = getFirestore();
  const remoteConfig = getRemoteConfig();

  const configService = getConfigService(remoteConfig);

  const openai = new OpenAI({ apiKey: openAiKey });
  const telegraf = new Telegraf(telegramBotToken);

  const userService = getUserService({ firestore });

  const openAiService = getOpenAiService({ openai });

  const suggestionService = getSuggestionService({
    openAiService,
    configService,
  });

  const phraseSummaryService = getPhraseSummaryService({
    openAiService,
    configService,
  });

  const phraseSummaryStorage = getStorageService<PhraseSummary>('summaries', { firestore });
  const failuresStorage = getStorageService<FailedItem>('failures', { firestore });

  const pubSub = new PubSub({
    projectId: 'learn-serbian-assistant',
  });

  const phraseSummaryQueueService = getPhraseSummaryQueueService({ pubSub });

  dependencies = {
    telegraf,
    telegram: telegraf.telegram,
    userService,
    configService,
    openAiService,
    phraseSummaryService,
    phraseSummaryStorage,
    failuresStorage,
    suggestionService,
    phraseSummaryQueueService,
  };

  return dependencies;
};

export const getTestDependencies = () =>
  getDependencies({
    openAiKey: process.env.OPEN_AI_KEY!,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!,
  });
