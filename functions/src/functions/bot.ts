import { onRequest } from 'firebase-functions/v2/https';
import { OPEN_AI_KEY, SECRET_TOKEN, TELEGRAM_BOT_TOKEN } from '../params';
import { configureBot } from '../bot/configureBot';
import { getDependencies } from '../dependencies';
import { verifySecretToken } from '../bot/verifySecretToken';

export const telegramBot = onRequest(
  {
    region: 'europe-west1',
    secrets: [TELEGRAM_BOT_TOKEN, OPEN_AI_KEY, SECRET_TOKEN],
  },
  async (req, res) => {
    try {
      if (!verifySecretToken(req, res, SECRET_TOKEN.value())) {
        return;
      }

      const dependencies = getDependencies({
        telegramBotToken: TELEGRAM_BOT_TOKEN.value(),
        openAiKey: OPEN_AI_KEY.value(),
      });

      configureBot(dependencies)();

      await dependencies.telegraf.handleUpdate(req.body, res);
    } catch (e) {
      console.error('Unable handle request', e);

      res.sendStatus(200);
    }
  },
);
