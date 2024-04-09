import OpenAI from 'openai';
import { getFirestore } from './apis/firestore';
import { Telegraf } from 'telegraf';
import { OpenAiService, getOpenAiService } from './services/openAiService';
import {
  WordDataRepository,
  getWordDataRepository,
} from './services/wordDataRepository';

import { UserRepository, getUserRepository } from './services/userRepository';
import { RemoteConfig, getRemoteConfig } from 'firebase-admin/remote-config';
import { ConfigService, getConfigService } from './services/configService';
import { Firestore } from 'firebase-admin/firestore';
import { PaywallService, getPaywallService } from './services/paywallService';
import {
  PhraseSummaryService,
  getPhraseSummaryService,
} from './services/phraseSummaryService';
import {
  SuggestionService,
  getSuggestionService,
} from './services/suggestionService';

export type GetDependenciesOptions = {
  telegramBotToken: string;
  openAiKey: string;
};

export interface Dependencies {
  firestore: Firestore;
  remoteConfig: RemoteConfig;
  openai: OpenAI;
  telegraf: Telegraf;
  wordDataRepository: WordDataRepository;
  userRepository: UserRepository;
  paywallService: PaywallService;
  configService: ConfigService;
  openAiService: OpenAiService;
  phraseSummaryService: PhraseSummaryService;
  suggestionService: SuggestionService;
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

  const wordDataRepository = getWordDataRepository(firestore);
  const userRepository = getUserRepository(firestore);

  const paywallService = getPaywallService({ userRepository, configService });
  const openAiService = getOpenAiService({ openai });

  const suggestionService = getSuggestionService({
    openAiService,
    configService,
  });

  const phraseSummaryService = getPhraseSummaryService({
    openAiService,
    configService,
  });

  dependencies = {
    firestore,
    remoteConfig,
    openai,
    telegraf,
    wordDataRepository,
    userRepository,
    paywallService,
    configService,
    openAiService,
    phraseSummaryService,
    suggestionService,
  };

  return dependencies;
};

export const getTestDependencies = () =>
  getDependencies({
    openAiKey: process.env.OPEN_AI_KEY!,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!,
  });
