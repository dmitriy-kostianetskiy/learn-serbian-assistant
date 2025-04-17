import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createObjectCsvWriter } from 'csv-writer';

import serviceAccount from '/Users/dmitriy/learn-serbian-assistant-firebase-adminsdk-9szqn-31ac0c81ca.json' with { type: 'json' };

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Function to flatten nested objects and arrays
function flattenObject(obj, parentKey = '', result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively flatten nested objects
      flattenObject(value, newKey, result);
    } else if (Array.isArray(value)) {
      // Convert arrays to a comma-separated string
      result[newKey] = value.join(', ');
    } else {
      // Assign primitive values directly
      result[newKey] = value;
    }
  }
  return result;
}

async function exportCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const data = [];

  snapshot.forEach((doc) => {
    const flattenedData = flattenObject({
      key: doc.id,
      ...doc.data(),
    });
    data.push(flattenedData);
  });

  // Define the CSV writer
  const csvWriter = createObjectCsvWriter({
    path: `${collectionName}.csv`,
    header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
  });

  // Write data to CSV
  await csvWriter.writeRecords(data);
  console.log(`✅ Exported ${collectionName} to ${collectionName}.csv`);
}

// Replace 'your-collection-name' with your actual collection
exportCollection('summaries');
