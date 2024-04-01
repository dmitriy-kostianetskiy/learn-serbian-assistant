import { onRequest } from 'firebase-functions/v2/https';
import { error } from 'firebase-functions/logger';
import { OPEN_AI_KEY, TELEGRAM_BOT_TOKEN } from '../params';
import { bootstrapBot } from '../bot';
import { getDependencies } from '../dependencies';

export const telegramBot = onRequest(
  { region: 'europe-west1', secrets: [TELEGRAM_BOT_TOKEN, OPEN_AI_KEY] },
  async (req, res) => {
    try {
      const dependencies = getDependencies();

      bootstrapBot(dependencies)();

      await dependencies.telegraf.handleUpdate(req.body, res);
    } catch (e) {
      error('Unable handle request', e);

      res.sendStatus(200);
    }
  },
);
