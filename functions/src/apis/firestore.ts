import admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';

export function getFirestore(): Firestore {
  const db = admin.firestore();

  db.settings({ ignoreUndefinedProperties: true });

  return db;
}
