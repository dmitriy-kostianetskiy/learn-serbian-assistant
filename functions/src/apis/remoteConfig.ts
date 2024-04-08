import admin from 'firebase-admin';
import { RemoteConfig } from 'firebase-admin/remote-config';

export const getRemoteConfig = (): RemoteConfig => admin.remoteConfig();
