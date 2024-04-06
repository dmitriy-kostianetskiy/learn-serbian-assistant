import {
  RemoteConfig,
  RemoteConfigTemplate,
} from 'firebase-admin/remote-config';
import { ConfigService, WellKnownParameter } from './configService.model';
import { extractValue } from './extractValue';

export const getConfigService = (remoteConfig: RemoteConfig): ConfigService => {
  let template: RemoteConfigTemplate | undefined;

  return {
    get: async (parameter: WellKnownParameter) => {
      template = template ?? (await remoteConfig.getTemplate());

      return extractValue(template, parameter);
    },
  };
};
