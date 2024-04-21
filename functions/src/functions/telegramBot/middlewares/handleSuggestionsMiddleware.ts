import { Context, NarrowedContext } from 'telegraf';
import { Dependencies } from '../../../dependencies';

import {
  CallbackQuery,
  InlineKeyboardButton,
  Message,
  Update,
} from 'telegraf/typings/core/types/typegram';
import { createPayload } from './createPayload';

type HandleSuggestionsMiddlewareDependencies = Pick<
  Dependencies,
  'phraseSummaryQueueService'
>;

export const handleSuggestionsMiddleware =
  ({ phraseSummaryQueueService }: HandleSuggestionsMiddlewareDependencies) =>
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

    const text = selectedOption.text;

    const payload = createPayload(text, context.message!, context.chat!);

    await phraseSummaryQueueService.add(payload);
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
