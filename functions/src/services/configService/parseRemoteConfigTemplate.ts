import { RemoteConfigTemplate } from 'firebase-admin/remote-config';
import { extractValue } from './extractValue';

export type RemoteConfigParameters = Record<
  string,
  string | number | boolean | object
>;

export const parseRemoteConfigTemplate = (
  template: RemoteConfigTemplate,
): RemoteConfigParameters => {
  const result: RemoteConfigParameters = {};

  for (const key in template.parameters) {
    const parameter = template.parameters[key];

    const parameterValue = extractValue(parameter);

    if (typeof parameterValue === 'undefined') {
      continue;
    }

    result[key] = parameterValue;
  }

  return result;
};
