import admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';

export const getFirestore = (): Firestore => {
  const db = admin.firestore();

  db.settings({ ignoreUndefinedProperties: true });

  return db;
};
