import { ConfigService } from '../configService';
import { getPrompService } from './promptService';

describe('AiDictionary', () => {
  test('should recognize verb and provide conjugations', async () => {
    // Arrange
    const template = '<word> <example>';
    const configService: ConfigService = {
      get: jest.fn(async () => template),
    };

    const promptService = getPrompService({ configService });

    // Act
    const { prompt, promptTemplate, promptHash } = await promptService.get({
      word: 'love',
      example: 'foo bar',
    });

    // Assert
    expect(prompt).toBe('love foo bar');
    expect(promptTemplate).toBe(template);
    expect(promptHash).toBe('93ebe0ca08789fa62e12916898764d8b');
  });
});
