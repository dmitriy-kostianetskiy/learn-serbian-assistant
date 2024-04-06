import {
  RemoteConfig,
  RemoteConfigTemplate,
} from 'firebase-admin/remote-config';
import { WellKnownParameter } from './model';
import { extractValue } from './extractValue';

export interface ConfigService {
  get(parameter: WellKnownParameter): Promise<string>;
}

export function getConfigService(remoteConfig: RemoteConfig): ConfigService {
  let template: RemoteConfigTemplate | undefined;

  return {
    get: async (parameter: WellKnownParameter) => {
      template = template ?? (await remoteConfig.getTemplate());

      return extractValue(template, parameter);
    },
  };
}
