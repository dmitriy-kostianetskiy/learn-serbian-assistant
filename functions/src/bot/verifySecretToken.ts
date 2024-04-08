import { Response, Request } from 'express';

export const verifySecretToken = (
  req: Request,
  res: Response,
  secretToken: string,
): boolean => {
  const secretTokenHeader = req.headers['x-telegram-bot-api-secret-token'];

  if (
    typeof secretTokenHeader === 'string' &&
    secretTokenHeader === secretToken
  ) {
    return true;
  }

  console.warn(
    'x-telegram-bot-api-secret-token header does not match with expected secret token.',
  );

  res.sendStatus(403);

  return false;
};
