import { GeneratePhraseSummaryPayload } from '../model/generatePhraseSummaryPayload';
import {
  Chat,
  Message,
  Update,
  User,
} from 'telegraf/typings/core/types/typegram';
import { UserDetails } from '../services/userService/userService';

export const createPayload = (
  text: string,
  message: Update.New & Update.NonChannel & Message,
  chat:
    | Chat.ChannelChat
    | Chat.PrivateChat
    | Chat.GroupChat
    | Chat.SupergroupChat,
): GeneratePhraseSummaryPayload => {
  const messageId = message.message_id;
  const chatId = chat.id;
  const userId = message.from.id;

  const userDetails = createUserDetails(message!.from);

  return {
    chatId,
    messageId,
    userId,
    userDetails,
    text,
  };
};

const createUserDetails = ({
  first_name,
  last_name,
  username,
}: User): UserDetails => {
  return {
    username,
    firstName: first_name,
    lastName: last_name,
  };
};
