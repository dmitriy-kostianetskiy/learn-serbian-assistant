import { initializeApp, cert } from 'firebase-admin/app';
import { writeFileSync } from 'fs';
import { getFirestore } from 'firebase-admin/firestore';

import serviceAccount from '/Users/dmitriy/learn-serbian-assistant-firebase-adminsdk-9szqn-31ac0c81ca.json' with { type: 'json' };

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function exportCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const data = [];

  snapshot.forEach((doc) => {
    data.push({
      key: doc.id,
      ...doc.data(),
    });
  });

  writeFileSync(`${collectionName}.json`, JSON.stringify(data, null, 2));
  console.log(`✅ Exported ${collectionName} to ${collectionName}.json`);
}

// Replace 'your-collection-name' with your actual collection
exportCollection('summaries');
