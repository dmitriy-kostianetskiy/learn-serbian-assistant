import { UserDetails } from './user';

export type GenerateSummaryPayload = Readonly<{
  userId: number;
  chatId: number;
  messageId?: number;
  text: string;
  userDetails: UserDetails;
}>;
