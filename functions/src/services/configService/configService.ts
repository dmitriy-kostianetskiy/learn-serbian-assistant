import { RemoteConfig } from 'firebase-admin/remote-config';
import {
  ConfigService,
  GetResult,
  WellKnownParameter,
} from './configService.model';
import {
  RemoteConfigParameters,
  parseRemoteConfigTemplate,
} from './parseRemoteConfigTemplate';

export const getConfigService = (remoteConfig: RemoteConfig): ConfigService => {
  let params: RemoteConfigParameters | undefined;

  return {
    async get<T extends WellKnownParameter = WellKnownParameter>(
      parameter: T,
    ): Promise<GetResult<T>> {
      if (!params) {
        const template = await remoteConfig.getTemplate();

        params = parseRemoteConfigTemplate(template);
      }

      const value = params[parameter];

      if (typeof value === 'undefined') {
        throw new Error(`Unable to get value of ${parameter}`);
      }

      return value as GetResult<T>;
    },
  };
};
