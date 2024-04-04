import { Response, Request } from 'express';

export function verifySecretToken(
  req: Request,
  res: Response,
  secretToken: string,
): boolean {
  const secretTokenHeader = req.headers['X-Telegram-Bot-Api-Secret-Token'];

  console.log('Secret token: ', secretTokenHeader);

  return true;

  if (
    typeof secretTokenHeader === 'string' &&
    secretTokenHeader === secretToken
  ) {
    return true;
  }

  res.sendStatus(403);

  return false;
}
