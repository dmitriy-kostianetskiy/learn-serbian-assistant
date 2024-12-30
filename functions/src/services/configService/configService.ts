import { RemoteConfig } from 'firebase-admin/remote-config';
import {
  RemoteConfigParameters,
  parseRemoteConfigTemplate,
} from './parseRemoteConfigTemplate';

export interface ConfigService {
  get<T extends string | number | boolean | object>(
    parameter: string,
  ): Promise<T>;
}

export const getConfigService = (remoteConfig: RemoteConfig): ConfigService => {
  let params: RemoteConfigParameters | undefined;

  return {
    async get<T>(parameter: string): Promise<T> {
      if (!params) {
        const template = await remoteConfig.getTemplate();

        params = parseRemoteConfigTemplate(template);
      }

      const value = params[parameter];

      if (typeof value === 'undefined') {
        throw new Error(`Unable to get value of ${parameter}`);
      }

      return value as T;
    },
  };
};
