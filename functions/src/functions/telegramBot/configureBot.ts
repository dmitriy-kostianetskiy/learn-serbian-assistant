import { Dependencies } from '../../dependencies';
import { handleStartCommandMiddleware } from './middlewares/handleStartCommandMiddleware';
import { handleSuggestionsMiddleware } from './middlewares/handleSuggestionsMiddleware';
import { message } from 'telegraf/filters';
import { handleTextMiddleware } from './middlewares/handleTextMiddleware';
import { errorMiddleware } from './middlewares/errorMiddleware';

export const configureBot = (dependencies: Dependencies) => () => {
  const { telegraf } = dependencies;

  telegraf.start(handleStartCommandMiddleware);
  telegraf.action(/^option-\d+$/, handleSuggestionsMiddleware(dependencies));
  telegraf.on(message('text'), handleTextMiddleware(dependencies));
  telegraf.catch(errorMiddleware);
};
