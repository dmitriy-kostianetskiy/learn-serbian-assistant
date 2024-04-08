import OpenAI from 'openai';
import { getFirestore } from './apis/firestore';
import { Telegraf } from 'telegraf';
import { OpenAiClient, getOpenAiClient } from './services/openAiClient';
import {
  WordDataRepository,
  getWordDataRepository,
} from './services/wordDataRepository';

import { UserRepository, getUserRepository } from './services/userRepository';
import { RemoteConfig, getRemoteConfig } from 'firebase-admin/remote-config';
import { ConfigService, getConfigService } from './services/configService';
import { Firestore } from 'firebase-admin/firestore';
import { PromptService, getPrompService } from './services/promptService';
import { PaywallService, getPaywallService } from './services/paywallService';

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
  openAiClient: OpenAiClient;
  promptService: PromptService;
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
  const openAiClient = getOpenAiClient({ openai });
  const promptService = getPrompService({ configService });

  dependencies = {
    firestore,
    remoteConfig,
    openai,
    telegraf,
    wordDataRepository,
    userRepository,
    paywallService,
    configService,
    openAiClient,
    promptService,
  };

  return dependencies;
};
