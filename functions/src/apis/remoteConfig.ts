import admin from 'firebase-admin';
import { RemoteConfig } from 'firebase-admin/remote-config';

export function getRemoteConfig(): RemoteConfig {
  return admin.remoteConfig();
}
