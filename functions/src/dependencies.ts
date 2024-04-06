import OpenAI from 'openai';
import { OPEN_AI_KEY, TELEGRAM_BOT_TOKEN } from './params';
import { getFirestore } from './apis/firestore';
import { Telegraf } from 'telegraf';
import { OpenAiClient, getOpenAiClient } from './services/openAiClient';
import {
  WordDataRepository,
  getWordDataRepository,
} from './services/wordDataRepository';

import { UserRepository, getUserRepository } from './services/userRepository';
import { RemoteConfig, getRemoteConfig } from 'firebase-admin/remote-config';
import {
  ConfigService,
  getConfigService,
} from './services/configService/configService';
import { Firestore } from 'firebase-admin/firestore';
import { PromptService, getPrompService } from './services/promptService';
import { PaywallService, getPaywallService } from './services/paywallService';

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

export const getDependencies = (): Dependencies => {
  if (dependencies) {
    return dependencies;
  }

  const firestore = getFirestore();
  const remoteConfig = getRemoteConfig();

  const configService = getConfigService(remoteConfig);

  const openai = new OpenAI({ apiKey: OPEN_AI_KEY.value() });
  const telegraf = new Telegraf(TELEGRAM_BOT_TOKEN.value());

  const wordDataRepository = getWordDataRepository(firestore);
  const userRepository = getUserRepository(firestore);

  const paywallService = getPaywallService({ userRepository });
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
