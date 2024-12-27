import { getTestDependencies } from '../dependencies';

describe('SuggestionService', () => {
  test('should provide suggestion for word "step"', async () => {
    // Arrange
    const { suggestionService } = getTestDependencies();

    // Act
    const suggestions = await suggestionService.generate('step');

    // Assert
    expect(suggestions.language).toBe('english');
    expect(suggestions.suggestions).not.toHaveLength(0);
  });

  test('should provide suggestion for word "шаг"', async () => {
    // Arrange
    const { suggestionService } = getTestDependencies();

    // Act
    const suggestions = await suggestionService.generate('шаг');

    // Assert
    expect(suggestions.language).toBe('russian');
    expect(suggestions.suggestions).not.toHaveLength(0);
  });

  test('should provide no suggestion for word "deca"', async () => {
    // Arrange
    const { suggestionService } = getTestDependencies();

    // Act
    const suggestions = await suggestionService.generate('deca');

    // Assert
    expect(suggestions.language).toBe('serbian');
    expect(suggestions.suggestions).toHaveLength(0);
  });

  test('should provide no suggestion for word "jj78 asd 12"', async () => {
    // Arrange
    const { suggestionService } = getTestDependencies();

    // Act
    const suggestions = await suggestionService.generate('jj78 asd 12');

    // Assert
    expect(suggestions.language).toBe('unknown');
    expect(suggestions.suggestions).toHaveLength(0);
  });

  test('should provide no suggestion for word "talas"', async () => {
    // Arrange
    const { suggestionService } = getTestDependencies();

    // Act
    const suggestions = await suggestionService.generate('talas');

    // Assert
    expect(suggestions.language).toBe('serbian');
    expect(suggestions.suggestions).toHaveLength(0);
  });

  test('should provide no suggestion for word "more"', async () => {
    // Arrange
    const { suggestionService } = getTestDependencies();

    // Act
    const suggestions = await suggestionService.generate('море');

    // Assert
    expect(suggestions.language).toBe('serbian');
    expect(suggestions.suggestions).toHaveLength(0);
  });
});
