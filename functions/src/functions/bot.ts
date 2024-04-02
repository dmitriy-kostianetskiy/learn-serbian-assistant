import { onRequest } from 'firebase-functions/v2/https';
import { error } from 'firebase-functions/logger';
import { OPEN_AI_KEY, SECRET_TOKEN, TELEGRAM_BOT_TOKEN } from '../params';
import { configureBot } from '../bot/configureBot';
import { getDependencies } from '../dependencies';

export const telegramBot = onRequest(
  {
    region: 'europe-west1',
    secrets: [TELEGRAM_BOT_TOKEN, OPEN_AI_KEY, SECRET_TOKEN],
  },
  async (req, res) => {
    try {
      // TODO: fix it
      // if (!verifySecretToken(req, res, SECRET_TOKEN.value())) {
      //   return;
      // }

      const dependencies = getDependencies();

      configureBot(dependencies)();

      await dependencies.telegraf.handleUpdate(req.body, res);
    } catch (e) {
      error('Unable handle request', e);

      res.sendStatus(200);
    }
  },
);
