import { GeneratePhraseSummaryPayload } from '../../../model/generatePhraseSummaryPayload';
import { User } from 'telegraf/typings/core/types/typegram';
import { UserDetails } from '../../../services/userService/userService';

export const createPayload = (
  text: string,
  user: User,
  chatId: number,
  messageId?: number,
): GeneratePhraseSummaryPayload => {
  const userId = user.id;

  const userDetails = createUserDetails(user);

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
