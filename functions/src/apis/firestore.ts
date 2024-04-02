import admin from 'firebase-admin';

export type Firestore = admin.firestore.Firestore;

admin.initializeApp();

export function getFirestore(): Firestore {
  return admin.firestore();
}
