import { Context } from 'telegraf';
import { Dependencies } from '../dependencies';
import { WordData } from '../model/wordData';
import { printWordData } from '../services/printWordData/printWordData';
import { replyToMessage } from '../utils/replyToMessage';
import { STRINGIFIED_EXAMPLE_WORD_DATA } from '../consts/example';

export const generateWordDataMiddleware =
  ({
    openAiClient,
    promptService,
    wordDataRepository,
  }: Pick<
    Dependencies,
    'openAiClient' | 'promptService' | 'wordDataRepository'
  >) =>
  async (context: Context) => {
    const word = context.text;
    const messageId = context.message?.message_id;

    if (!word || !messageId) {
      return;
    }

    const { prompt, promptHash } = await promptService.get({
      word,
      example: STRINGIFIED_EXAMPLE_WORD_DATA,
    });

    let wordData = await wordDataRepository.get(promptHash);

    if (!wordData) {
      wordData = await openAiClient.promptAsJson<WordData>(prompt);

      await wordDataRepository.add(promptHash, wordData);
    }

    const message = printWordData(wordData);

    await replyToMessage(context)(message, messageId);
  };
