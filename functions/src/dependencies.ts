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

export interface Dependencies {
  firestore: admin.firestore.Firestore;
  openai: OpenAI;
  telegraf: Telegraf;
  aiDictionary: AiDictionary;
  wordDataRepository: WordDataRepository;
  dictionary: Dictionary;
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
  const dictionary = getDictionary(aiDictionary, wordDataRepository);

  dependencies = {
    firestore,
    openai,
    telegraf,
    aiDictionary,
    wordDataRepository,
    dictionary,
  };

  return dependencies;
}
