import OpenAI from 'openai';
import { OPEN_AI_KEY, TELEGRAM_BOT_TOKEN } from './params';
import { getFirestore } from './apis/firestore';
import admin from 'firebase-admin';
import { Telegraf } from 'telegraf';
import {
  AiDictionary,
  getAiDictionary,
} from './services/aiDictionary/aiDictionary';
import {
  WordDataRepository,
  getWordDataRepository,
} from './services/wordDataRepository';
import { Dictionary, getDictionary } from './services/dictionary';
import { Paywall, getPaywall } from './services/paywall';
import { UserRepository, getUserRepository } from './services/userRepository';

export interface Dependencies {
  firestore: admin.firestore.Firestore;
  openai: OpenAI;
  telegraf: Telegraf;
  aiDictionary: AiDictionary;
  wordDataRepository: WordDataRepository;
  userRepository: UserRepository;
  dictionary: Dictionary;
  paywall: Paywall;
}

let dependencies: Dependencies | undefined;

export function getDependencies(): Dependencies {
  if (dependencies) {
    return dependencies;
  }

  const firestore = getFirestore();

  const openai = new OpenAI({ apiKey: OPEN_AI_KEY.value() });
  const telegraf = new Telegraf(TELEGRAM_BOT_TOKEN.value());

  const aiDictionary = getAiDictionary(openai);

  const wordDataRepository = getWordDataRepository(firestore);
  const userRepository = getUserRepository(firestore);

  const paywall = getPaywall(userRepository);
  const dictionary = getDictionary(aiDictionary, wordDataRepository, paywall);

  dependencies = {
    firestore,
    openai,
    telegraf,
    aiDictionary,
    wordDataRepository,
    userRepository,
    dictionary,
    paywall,
  };

  return dependencies;
}
