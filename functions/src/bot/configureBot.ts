import { message } from 'telegraf/filters';
import { Dependencies } from '../dependencies';
import { updateUserMiddleware } from '../middlewares/updateUserMiddleware';
import { sendWelcomeMessageMiddleware } from '../middlewares/sendWelcomeMessageMiddleware';
import { paywallMiddleware } from '../middlewares/paywallMiddleware';
import { generatePhraseSummaryMiddleware } from '../middlewares/generatePhraseSummaryMiddleware';
import { generateSuggestionsMiddleware } from '../middlewares/generateSuggestionsMiddleware';
import { handleSuggestionsMiddleware } from '../middlewares/handleSuggestionsMiddleware';

export const configureBot = (dependencies: Dependencies) => () => {
  const { telegraf } = dependencies;

  telegraf.start(
    updateUserMiddleware(dependencies),
    sendWelcomeMessageMiddleware(dependencies),
  );

  telegraf.action(
    /^suggestion-\d+$/,
    handleSuggestionsMiddleware(dependencies),
  );

  telegraf.on(
    message('text'),
    updateUserMiddleware(dependencies),
    paywallMiddleware(dependencies),
    generateSuggestionsMiddleware(dependencies),
    generatePhraseSummaryMiddleware(dependencies),
  );
};
