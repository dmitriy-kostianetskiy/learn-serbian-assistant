import { writeFileSync } from 'fs';
import data from '../summaries.json' with { type: 'json' };
import { createObjectCsvWriter } from 'csv-writer';

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

// Function to convert JSON to CSV
async function jsonToCsv(jsonArray, outputFilePath) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    throw new Error('Input JSON must be a non-empty array.');
  }

  // Flatten all objects in the array
  const flattenedData = jsonArray.map((item) => flattenObject(item));

  // Define the CSV writer
  const csvWriter = createObjectCsvWriter({
    path: outputFilePath,
    header: Object.keys(flattenedData[0]).map((key) => ({
      id: key,
      title: key,
    })),
  });

  // Write data to CSV
  await csvWriter.writeRecords(flattenedData);
  console.log(`✅ CSV file has been created at ${outputFilePath}`);
}

jsonToCsv(data, 'output.csv').then();
