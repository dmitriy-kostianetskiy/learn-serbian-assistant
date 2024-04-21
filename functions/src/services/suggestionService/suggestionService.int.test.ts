import { getTestDependencies } from '../../dependencies';
import { getSuggestionService } from './suggestionService';
import { SuggestionService } from './suggestionService';

describe('SuggestionService', () => {
  let service: SuggestionService;

  beforeAll(() => {
    const dependencies = getTestDependencies();
    service = getSuggestionService(dependencies);
  });

  test('should provide suggestion for word "step"', async () => {
    // Act
    const suggestions = await service.generate('step');

    // Assert
    expect(suggestions.language).toBe('english');
    expect(suggestions.suggestions).not.toHaveLength(0);
  });

  test('should provide suggestion for word "шаг"', async () => {
    // Act
    const suggestions = await service.generate('шаг');

    // Assert
    expect(suggestions.language).toBe('russian');
    expect(suggestions.suggestions).not.toHaveLength(0);
  });

  test('should provide no suggestion for word "deca"', async () => {
    // Act
    const suggestions = await service.generate('deca');

    // Assert
    expect(suggestions.language).toBe('serbian');
    expect(suggestions.suggestions).toHaveLength(0);
  });

  test('should provide no suggestion for word "jj78 asd 12"', async () => {
    // Act
    const suggestions = await service.generate('jj78 asd 12');

    // Assert
    expect(suggestions.language).toBe('unknown');
    expect(suggestions.suggestions).toHaveLength(0);
  });
});
