import { message } from 'telegraf/filters';
import { Dependencies } from '../dependencies';
import { updateUserMiddleware } from '../middlewares/updateUserMiddleware';
import { sendWelcomeMessageMiddleware } from '../middlewares/sendWelcomeMessageMiddleware';
import { paywallMiddleware } from '../middlewares/paywallMiddleware';
import { generateWordDataMiddleware } from '../middlewares/generateWordDataMiddleware';

export const configureBot = (dependencies: Dependencies) => () => {
  const { telegraf } = dependencies;

  telegraf.start(
    updateUserMiddleware(dependencies),
    sendWelcomeMessageMiddleware(dependencies),
  );

  telegraf.on(
    message('text'),
    updateUserMiddleware(dependencies),
    paywallMiddleware(dependencies),
    generateWordDataMiddleware(dependencies),
  );
};
