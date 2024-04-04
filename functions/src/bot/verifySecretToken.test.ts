import { Request, Response } from 'express';
import { verifySecretToken } from './verifySecretToken';

describe('verifySecretToken', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      headers: {
        ['x-telegram-bot-api-secret-token']: 'SECRET!!!',
      },
    } as unknown as Request;

    res = {
      sendStatus: jest.fn(),
    } as unknown as Response;
  });

  test('should return true and should not send 403', async () => {
    // Arrange & Act
    const result = verifySecretToken(req, res, 'SECRET!!!');

    // Assert
    expect(result).toBeTruthy();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  test('should return false and send 403 if secretToken does not match', async () => {
    // Arrange & Act
    const result = verifySecretToken(req, res, 'WRONG!!!');

    // Assert
    expect(result).toBeFalsy();
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });
});
