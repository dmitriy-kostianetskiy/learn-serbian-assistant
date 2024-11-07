import { UserDetails } from './user';

export type GeneratePhraseSummaryPayload = Readonly<{
  userId: number;
  chatId: number;
  messageId?: number;
  text: string;
  userDetails: UserDetails;
}>;
