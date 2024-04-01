import admin from 'firebase-admin';

export function getFirestore(): admin.firestore.Firestore {
  admin.initializeApp();

  return admin.firestore();
}
