import { UserDetails } from '../services/userService/userService';

export type GeneratePhraseSummaryPayload = Readonly<{
  userId: number;
  chatId: number;
  messageId?: number;
  text: string;
  userDetails: UserDetails;
}>;
