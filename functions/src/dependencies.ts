import OpenAI from 'openai';
import { getFirestore } from './apis/firestore';
import { Telegraf, Telegram } from 'telegraf';
import { OpenAiService, getOpenAiService } from './services/openAiService';
import { UserService, getUserService } from './services/userService';
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
import {
  getPromptBuilderService,
  PromptBuilderService,
} from './services/prompt-builder';

export type GetDependenciesOptions = {
  telegramBotToken: string;
  openAiKey: string;
  summaryUserPromptName?: string;
  summaryDeveloperPromptName?: string;
  summaryAssistantPromptName?: string;
  suggestionsUserPromptName?: string;
  suggestionsDeveloperPromptName?: string;
  suggestionsAssistantPromptName?: string;
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
  promptBuilderService: PromptBuilderService;
}

let dependencies: Dependencies | undefined;

export const getDependencies = ({
  openAiKey,
  telegramBotToken,
  summaryUserPromptName,
  summaryDeveloperPromptName,
  summaryAssistantPromptName,
  suggestionsUserPromptName,
  suggestionsDeveloperPromptName,
  suggestionsAssistantPromptName,
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

  const promptBuilderService = getPromptBuilderService({
    configService,
  });

  const suggestionService = getSuggestionService({
    openAiService,
    promptBuilderService,
    userPromptName: suggestionsUserPromptName ?? 'suggestionsUserPrompt',
    developerPromptName:
      suggestionsDeveloperPromptName ?? 'suggestionsDeveloperPrompt',
    assistantPromptName:
      suggestionsAssistantPromptName ?? 'suggestionsAssistantPrompt',
  });

  const summaryService = getSummaryService({
    openAiService,
    promptBuilderService,
    userPromptName: summaryUserPromptName ?? 'summaryUserPrompt',
    developerPromptName: summaryDeveloperPromptName ?? 'summaryDeveloperPrompt',
    assistantPromptName: summaryAssistantPromptName ?? 'summaryAssistantPrompt',
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
    promptBuilderService,
  };

  return dependencies;
};

export const getTestDependencies = () =>
  getDependencies({
    openAiKey: process.env.OPEN_AI_KEY!,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!,
    summaryUserPromptName: process.env.SUMMARY_USER_PROMPT_NAME!,
    summaryDeveloperPromptName: process.env.SUMMARY_DEVELOPER_PROMPT_NAME!,
    summaryAssistantPromptName: process.env.SUMMARY_ASSISTANT_PROMPT_NAME!,
    suggestionsUserPromptName: process.env.SUGGESTIONS_USER_PROMPT_NAME!,
    suggestionsDeveloperPromptName:
      process.env.SUGGESTIONS_DEVELOPER_PROMPT_NAME!,
    suggestionsAssistantPromptName:
      process.env.SUGGESTIONS_ASSISTANT_PROMPT_NAME!,
  });
