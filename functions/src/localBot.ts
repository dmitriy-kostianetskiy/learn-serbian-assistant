import './apis/firebase';

import { configureBot } from './functions/telegramBot/configureBot';
import { getTestDependencies } from './dependencies';

(async () => {
  const dependencies = getTestDependencies();

  configureBot(dependencies)();

  await dependencies.telegraf.launch();
})();
