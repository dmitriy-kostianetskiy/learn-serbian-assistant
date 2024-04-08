import './apis/firebase';

import { configureBot } from './bot/configureBot';
import { getDependencies } from './dependencies';

(async () => {
  const dependencies = getDependencies({
    openAiKey: process.env.OPEN_AI_KEY!,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!,
  });

  configureBot(dependencies)();

  await dependencies.telegraf.launch();
})();
