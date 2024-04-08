import { parseRemoteConfigTemplate } from './parseRemoteConfigTemplate';

describe('parseRemoteConfigTemplate', () => {
  test('should parse the input', async () => {
    // Act
    const values = parseRemoteConfigTemplate({
      parameters: {
        foo: {
          defaultValue: {
            value: 'bar',
          },
          valueType: 'STRING',
        },
        buzz: {
          defaultValue: {
            value: '1',
          },
          valueType: 'NUMBER',
        },
        fuzz: {
          defaultValue: {
            useInAppDefault: true,
          },
          valueType: 'NUMBER',
        },
      },
      conditions: [],
      etag: '123',
      parameterGroups: {},
    });

    // Assert
    expect(values['foo']).toBe('bar');
    expect(values['buzz']).toBe(1);
    expect(values['fuzz']).toBeUndefined();
  });
});
