import { Telegram } from 'telegraf';
import { suggestionsMiddleware } from './suggestionsMiddleware';
import { Message } from '../../../consts/message';
import { Context } from './context';
import { SuggestionService } from '../../../services/suggestionService';
import { Suggestions } from '../../../model/suggestions';
import { EventService } from '../../../services/eventsService';
import { ConfigService } from '../../../services/configService';

describe('suggestionsMiddleware', () => {
  const createContext = (suggestions: Suggestions): Context => {
    const suggestionService: SuggestionService = {
      generate: jest.fn(async () => {
        return suggestions;
      }),
    };

    const telegram = {
      sendMessage: jest.fn(),
    } as unknown as Telegram;

    const eventsService = {
      add: jest.fn(),
    } as unknown as EventService;

    const configService = {
      get: jest.fn(async () => false),
    } as unknown as ConfigService;

    return {
      dependencies: {
        suggestionService,
        telegram,
        eventsService,
        configService,
      },
      payload: {
        userId: 0,
        chatId: 0,
        messageId: 0,
        userDetails: {},
      },
    } as Context;
  };

  test('should pass if the phrase is in serbian', async () => {
    // Arrange
    const suggestions: Suggestions = {
      language: 'serbian',
      suggestions: [],
    };

    const context = createContext(suggestions);
    const next = jest.fn();

    // Act
    await suggestionsMiddleware(context, next);

    // Assert
    expect(next).toHaveBeenCalled();

    expect(context.dependencies.telegram.sendMessage).not.toHaveBeenCalled();
  });

  test('should not pass and reply with options if the phrase is in english', async () => {
    // Arrange
    const suggestions: Suggestions = {
      language: 'english',
      suggestions: ['dete'],
    };

    const context = createContext(suggestions);
    const next = jest.fn();

    // Act
    await suggestionsMiddleware(context, next);

    // Assert
    expect(next).not.toHaveBeenCalled();

    expect(context.dependencies.telegram.sendMessage).toHaveBeenCalledWith(
      expect.any(Number),
      Message.PhraseIsNotInSerbian,
      expect.objectContaining({
        reply_markup: {
          reply_parameters: undefined,
          inline_keyboard: [
            [
              {
                text: 'dete',
                callback_data: 'option-0',
              },
            ],
          ],
        },
      }),
    );
  });

  test('should not pass and reply with error message if no suggestions', async () => {
    // Arrange
    const suggestions: Suggestions = {
      language: 'unknown',
      suggestions: [],
    };

    const context = createContext(suggestions);
    const next = jest.fn();

    // Act
    await suggestionsMiddleware(context, next);

    // Assert
    expect(next).not.toHaveBeenCalled();

    expect(context.dependencies.telegram.sendMessage).toHaveBeenCalledWith(
      expect.any(Number),
      Message.PhraseCanNotBeInterpret,
      expect.any(Object),
    );
  });
});
