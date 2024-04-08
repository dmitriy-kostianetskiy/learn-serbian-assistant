import {
  ParameterValueType,
  RemoteConfigParameter,
} from 'firebase-admin/remote-config';

export const extractValue = (
  parameter: RemoteConfigParameter,
): string | number | boolean | object | undefined => {
  const parameterDefaultValue = parameter.defaultValue;

  if (!parameterDefaultValue || !('value' in parameterDefaultValue)) {
    return undefined;
  }

  return parseValue(parameterDefaultValue.value, parameter.valueType);
};

const parseValue = (
  rawValue: string,
  valueType?: ParameterValueType,
): string | number | boolean | object => {
  switch (valueType) {
    case 'BOOLEAN':
      return rawValue === 'true';
    case 'JSON':
      return JSON.parse(rawValue);
    case 'NUMBER':
      return +rawValue;
    default:
      return rawValue;
  }
};
