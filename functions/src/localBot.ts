import './apis/firebase';

import { configureBot } from './bot/configureBot';
import { getTestDependencies } from './dependencies';

(async () => {
  const dependencies = getTestDependencies();

  configureBot(dependencies)();

  await dependencies.telegraf.launch();
})();
