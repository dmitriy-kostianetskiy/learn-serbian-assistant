import { getRemoteConfig } from '../apis/remoteConfig';
import { ServerConfig } from '../model/server-config';

export const getServerConfig = async (): Promise<ServerConfig> => {
  const remoteConfig = getRemoteConfig();

  const template = await remoteConfig.getServerTemplate({
    defaultConfig: {
      dailyQuota: 10,
    },
  });

  const config = template.evaluate();

  return {
    dailyQuota: config.getNumber('dailyQuota'),
    summarySystemPrompt: config.getString('summarySystemPrompt'),
  };
};
