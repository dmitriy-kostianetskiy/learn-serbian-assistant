import { CollectionReference, DocumentData } from 'firebase-admin/firestore';

export async function deleteCollection(
  collection: CollectionReference<DocumentData>,
): Promise<void> {
  const documents = await collection.get();

  for (const { id } of documents.docs) {
    await collection.doc(id).delete();
  }
}
