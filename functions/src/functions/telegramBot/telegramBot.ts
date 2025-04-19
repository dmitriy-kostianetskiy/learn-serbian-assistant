import { onRequest } from 'firebase-functions/v2/https';
import { getDependencies } from '../../dependencies';
import { verifySecretToken } from '../../bot/verifySecretToken';
import { configureBot } from './configureBot';
import { Secret } from '../../consts/secret';

export const telegramBot = onRequest(
  {
    region: 'europe-west1',
    secrets: [Secret.TelegramBotToken, Secret.OpenAiKey, Secret.SecretToken],
  },
  async (req, res) => {
    try {
      if (!verifySecretToken(req, res, Secret.SecretToken.value())) {
        return;
      }

      const dependencies = await getDependencies({
        telegramBotToken: Secret.TelegramBotToken.value(),
        openAiKey: Secret.OpenAiKey.value(),
      });

      configureBot(dependencies)();

      await dependencies.telegraf.handleUpdate(req.body, res);
    } catch (e) {
      console.error('Unable handle request', e);

      res.sendStatus(200);
    }
  },
);
