import { defineSecret } from 'firebase-functions/params';

export const Secret = {
  OpenAiKey: defineSecret('OPEN_AI_KEY'),
  TelegramBotToken: defineSecret('OPEN_AI_KEY'),
  SecretToken: defineSecret('SECRET_TOKEN'),
} as const;
