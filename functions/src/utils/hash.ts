import crypto from 'crypto';

export const hash = (input: string): string =>
  crypto.createHash('md5').update(input).digest('hex');
