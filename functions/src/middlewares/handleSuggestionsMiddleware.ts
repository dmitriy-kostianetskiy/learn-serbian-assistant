import { Context, NarrowedContext } from 'telegraf';
import { Dependencies } from '../dependencies';
import { replyToMessage } from '../utils/replyToMessage';

import {
  CallbackQuery,
  InlineKeyboardButton,
  Message,
  Update,
} from 'telegraf/typings/core/types/typegram';

type HandleSuggestionsMiddlewareDependencies = Pick<
  Dependencies,
  'phraseSummaryService'
>;

export const handleSuggestionsMiddleware =
  ({ phraseSummaryService }: HandleSuggestionsMiddlewareDependencies) =>
  async (
    context: NarrowedContext<
      Context<Update>,
      Update.CallbackQueryUpdate<CallbackQuery>
    >,
  ) => {
    const selectedOption = findSelectedOption(
      context.callbackQuery as CallbackQuery.DataQuery,
    );

    if (!selectedOption) {
      await context.answerCbQuery();

      return;
    }

    const phrase = selectedOption.text;

    const phraseSummary = await phraseSummaryService.generate(phrase);

    await replyToMessage(context)(
      phraseSummary,
      context.callbackQuery.message?.message_id,
    );
  };

const findSelectedOption = (callbackQuery: CallbackQuery.DataQuery) => {
  const message = callbackQuery.message as Message.CommonMessage | undefined;

  return message?.reply_markup?.inline_keyboard
    .flatMap((items) => items)
    .find((button) => {
      const callbackButton = button as InlineKeyboardButton.CallbackButton;

      return callbackButton.callback_data === callbackQuery.data;
    });
};
