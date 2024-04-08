import { extractValue } from './extractValue';

describe('extractValue', () => {
  test('should extract string value', async () => {
    // Act
    const value = extractValue({
      defaultValue: {
        value: 'foo bar',
      },
      valueType: 'STRING',
    });

    // Assert
    expect(value).toBe('foo bar');
  });

  test('should extract boolean value', async () => {
    // Act
    const value = extractValue({
      defaultValue: {
        value: 'true',
      },
      valueType: 'BOOLEAN',
    });

    // Assert
    expect(value).toBe(true);
  });

  test('should extract numeric value', async () => {
    // Act
    const value = extractValue({
      defaultValue: {
        value: '123.456',
      },
      valueType: 'NUMBER',
    });

    // Assert
    expect(value).toBe(123.456);
  });

  test('should extract JSON value', async () => {
    // Act
    const value = extractValue({
      defaultValue: {
        value: '{ "foo": "bar" }',
      },
      valueType: 'JSON',
    });

    // Assert
    expect(value).toMatchObject({
      foo: 'bar',
    });
  });

  test('should extract undefined value', async () => {
    // Act
    const value = extractValue({
      defaultValue: {
        useInAppDefault: true,
      },
    });

    // Assert
    expect(value).toBeUndefined();
  });
});
