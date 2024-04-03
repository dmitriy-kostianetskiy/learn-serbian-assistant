import admin from 'firebase-admin';

export type Firestore = admin.firestore.Firestore;

admin.initializeApp();

export function getFirestore(): Firestore {
  const db = admin.firestore();

  db.settings({ ignoreUndefinedProperties: true });

  return db;
}
