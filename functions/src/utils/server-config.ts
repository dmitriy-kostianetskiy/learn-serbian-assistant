import { getRemoteConfig } from '../apis/remoteConfig';
import { ServerConfig } from '../model/server-config';

const DEFAULT_CONFIG: Omit<ServerConfig, 'summarySystemPrompt'> = {
  dailyQuota: 10,
};

export const getServerConfig = async (): Promise<ServerConfig> => {
  const remoteConfig = getRemoteConfig();

  const template = await remoteConfig.getServerTemplate({
    defaultConfig: DEFAULT_CONFIG,
  });

  const config = template.evaluate();

  return {
    dailyQuota: config.getNumber('dailyQuota'),
    summarySystemPrompt: config.getString('summarySystemPrompt'),
  };
};
