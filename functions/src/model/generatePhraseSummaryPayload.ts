import { UserDetails } from '../services/userService/userService';

export type GeneratePhraseSummaryPayload = Readonly<{
  userId: number;
  messageId: number;
  chatId: number;
  text: string;
  userDetails: UserDetails;
}>;
