import { defineSecret } from 'firebase-functions/params';

export const Secret = {
  OpenAiKey: defineSecret('OPEN_AI_KEY'),
  TelegramBotToken: defineSecret('TELEGRAM_BOT_TOKEN'),
  SecretToken: defineSecret('SECRET_TOKEN'),
} as const;
