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
import { SummaryService, getSummaryService } from './services/summaryService';
import {
  SuggestionService,
  getSuggestionService,
} from './services/suggestionService';
import { PubSub } from '@google-cloud/pubsub';
import {
  SummaryQueueService,
  getSummaryQueueService,
} from './services/summaryQueueService';
import { Summary } from './model/summary';
import { StorageService, getStorageService } from './services/storageService';
import { EventService, getEventsService } from './services/eventsService';

export type GetDependenciesOptions = {
  telegramBotToken: string;
  openAiKey: string;
  summaryUserPromptName?: string;
  summarySystemPromptName?: string;
};

export interface Dependencies {
  telegraf: Telegraf;
  telegram: Telegram;
  userService: UserService;
  configService: ConfigService;
  openAiService: OpenAiService;
  summaryService: SummaryService;
  summaryStorage: StorageService<Summary>;
  eventsService: EventService;
  suggestionService: SuggestionService;
  summaryQueueService: SummaryQueueService;
}

let dependencies: Dependencies | undefined;

export const getDependencies = ({
  openAiKey,
  telegramBotToken,
  summaryUserPromptName,
  summarySystemPromptName,
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

  const summaryService = getSummaryService({
    openAiService,
    configService,
    summaryUserPromptName,
    summarySystemPromptName,
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
    openAiService,
    summaryService,
    summaryStorage,
    eventsService,
    suggestionService,
    summaryQueueService,
  };

  return dependencies;
};

export const getTestDependencies = () =>
  getDependencies({
    openAiKey: process.env.OPEN_AI_KEY!,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!,
    summaryUserPromptName: process.env.SUMMARY_USER_PROMPT_NAME!,
    summarySystemPromptName: process.env.SUMMARY_SYSTEM_PROMPT_NAME!,
  });
