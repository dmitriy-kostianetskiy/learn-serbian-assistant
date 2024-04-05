import {
  RemoteConfig,
  RemoteConfigTemplate,
} from 'firebase-admin/remote-config';

type WellKnownParameter = 'wordDataPrompt';

export interface Config {
  getWordDataPrompt(): Promise<string>;
}

export function getConfig(remoteConfig: RemoteConfig): Config {
  let template: RemoteConfigTemplate | undefined;

  return {
    getWordDataPrompt: async () => {
      template = template ?? (await remoteConfig.getTemplate());

      return extractValue(template, 'wordDataPrompt');
    },
  };
}

function extractValue(
  template: RemoteConfigTemplate,
  parameterName: WellKnownParameter,
): string {
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
}
