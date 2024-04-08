import { CollectionReference, DocumentData } from 'firebase-admin/firestore';

export const deleteCollection = async (
  collection: CollectionReference<DocumentData>,
): Promise<void> => {
  const documents = await collection.get();

  for (const { id } of documents.docs) {
    await collection.doc(id).delete();
  }
};
