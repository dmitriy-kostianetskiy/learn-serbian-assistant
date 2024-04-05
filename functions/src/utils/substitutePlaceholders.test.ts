import { substitutePlaceholders } from './substitutePlaceholders';

describe('Test substitutePlaceholders function', () => {
  test('should replace all placeholders with values', () => {
    const text = '<a> <b> <c>';
    const values = {
      a: '1',
      b: '2',
      c: '3',
    };

    const expected = '1 2 3';
    const actual = substitutePlaceholders(text, values);

    expect(actual).toEqual(expected);
  });

  test('should replace all found placeholders with the same value', () => {
    const text = '<a> <a> <a> <b>';
    const values = {
      a: '1',
      b: '2',
    };

    const expected = '1 1 1 2';
    const actual = substitutePlaceholders(text, values);

    expect(actual).toEqual(expected);
  });

  test('should leave text unchanged if no placeholders are found', () => {
    const text = 'a b c';
    const values = {
      unitTestPlaceholder: '1',
    };

    const expected = 'a b c';
    const actual = substitutePlaceholders(text, values);

    expect(actual).toEqual(expected);
  });
});
