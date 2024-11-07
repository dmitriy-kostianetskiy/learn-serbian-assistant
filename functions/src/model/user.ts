export type UserDetails = Readonly<{
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}>;

export type User = Readonly<{
  userId: string;
  hasPremium: boolean;
  dailyQuotaUsed: number;
  userDetails: UserDetails;
}>;
