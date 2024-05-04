import { GIVE_EXAMPLE } from '../../test/examples/give';
import { TABLE_EXAMPLE } from '../../test/examples/table';
import {
  ValidatePhraseSummaryError,
  validatePhraseSummary,
} from './validatePhraseSummary';

describe('validatePhraseSummary', () => {
  it('should fail validation if definition is empty', () => {
    // Arrange
    const summary: typeof TABLE_EXAMPLE = {
      ...TABLE_EXAMPLE,
      definition: undefined,
    };

    // Act
    const { errors, passed } = validatePhraseSummary(summary);

    // Assert
    expect(passed).toBeFalsy();
    expect(errors).toHaveLength(3);
    expect(errors[0]).toMatchObject<Partial<ValidatePhraseSummaryError>>({
      path: 'definition.serbian',
      validator: 'isDefined',
    });
    expect(errors[1]).toMatchObject<Partial<ValidatePhraseSummaryError>>({
      path: 'definition.english',
      validator: 'isDefined',
    });
    expect(errors[2]).toMatchObject<Partial<ValidatePhraseSummaryError>>({
      path: 'definition.russian',
      validator: 'isDefined',
    });
  });

  it('should fail validation if translation is empty', () => {
    // Arrange
    const summary: typeof TABLE_EXAMPLE = {
      ...TABLE_EXAMPLE,
      translation: undefined,
    };

    // Act
    const { errors, passed } = validatePhraseSummary(summary);

    // Assert
    expect(passed).toBeFalsy();
    expect(errors).toHaveLength(2);
    expect(errors[0]).toMatchObject<Partial<ValidatePhraseSummaryError>>({
      path: 'translation.english',
      validator: 'isDefined',
    });
    expect(errors[1]).toMatchObject<Partial<ValidatePhraseSummaryError>>({
      path: 'translation.russian',
      validator: 'isDefined',
    });
  });

  it('should fail validation if example is empty', () => {
    // Arrange
    const summary: typeof TABLE_EXAMPLE = {
      ...TABLE_EXAMPLE,
      example: undefined,
    };

    // Act
    const { errors, passed } = validatePhraseSummary(summary);

    // Assert
    expect(passed).toBeFalsy();
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject<Partial<ValidatePhraseSummaryError>>({
      path: 'example',
      validator: 'isDefined',
    });
  });

  it('should fail validation if grammaticalGender is empty', () => {
    // Arrange
    const summary: typeof TABLE_EXAMPLE = {
      ...TABLE_EXAMPLE,
      grammaticalGender: undefined,
    };

    // Act
    const { errors, passed } = validatePhraseSummary(summary);

    // Assert
    expect(passed).toBeFalsy();
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject<Partial<ValidatePhraseSummaryError>>({
      path: 'grammaticalGender',
      validator: 'isDefined',
    });
  });

  it('should fail validation if grammaticalNumber is empty', () => {
    // Arrange
    const summary: typeof TABLE_EXAMPLE = {
      ...TABLE_EXAMPLE,
      grammaticalNumber: undefined,
    };

    // Act
    const { errors, passed } = validatePhraseSummary(summary);

    // Assert
    expect(passed).toBeFalsy();
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject<Partial<ValidatePhraseSummaryError>>({
      path: 'grammaticalNumber',
      validator: 'isDefined',
    });
  });

  it('should fail validation if synonyms is empty', () => {
    // Arrange
    const summary: typeof TABLE_EXAMPLE = {
      ...TABLE_EXAMPLE,
      synonyms: undefined,
    };

    // Act
    const { errors, passed } = validatePhraseSummary(summary);

    // Assert
    expect(passed).toBeFalsy();
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject<Partial<ValidatePhraseSummaryError>>({
      path: 'synonyms',
      validator: 'isDefined',
    });
  });

  it('should fail validation if cases is empty', () => {
    // Arrange
    const summary: typeof TABLE_EXAMPLE = {
      ...TABLE_EXAMPLE,
      cases: {},
    };

    // Act
    const { errors, passed } = validatePhraseSummary(summary);

    // Assert
    expect(passed).toBeFalsy();
    expect(errors).toHaveLength(14);
  });

  it('should fail validation if conjugations is empty', () => {
    // Arrange
    const summary: typeof GIVE_EXAMPLE = {
      ...GIVE_EXAMPLE,
      conjugations: {},
    };

    // Act
    const { errors, passed } = validatePhraseSummary(summary);

    // Assert
    expect(passed).toBeFalsy();
    expect(errors).toHaveLength(6);
  });

  it('should fail validation if infinitive is empty', () => {
    // Arrange
    const summary: typeof GIVE_EXAMPLE = {
      ...GIVE_EXAMPLE,
      infinitive: undefined,
    };

    // Act
    const { errors, passed } = validatePhraseSummary(summary);

    // Assert
    expect(passed).toBeFalsy();
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject<Partial<ValidatePhraseSummaryError>>({
      path: 'infinitive',
      validator: 'isDefined',
    });
  });
});
