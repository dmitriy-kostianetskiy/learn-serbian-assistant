import { RemoteConfigTemplate } from 'firebase-admin/remote-config';
import { WellKnownParameter } from './model';

export const extractValue = (
  template: RemoteConfigTemplate,
  parameterName: WellKnownParameter,
): string => {
  const parameter = template.parameters[parameterName];

  if (!parameter) {
    throw new Error(
      `Unable to get remote config: parameter '${parameterName}' is not found.`,
    );
  }

  const parameterDefaultValue = parameter.defaultValue;
  if (!parameterDefaultValue) {
    throw new Error(
      `Unable to get remote config: parameter '${parameterName}' default value is not set.`,
    );
  }

  if (!('value' in parameterDefaultValue)) {
    throw new Error(
      `Unable to get remote config: parameter '${parameterName}' value field is not set.`,
    );
  }

  return parameterDefaultValue.value;
};
