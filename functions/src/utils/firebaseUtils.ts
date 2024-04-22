export const deleteCollection = async (
  firestore: FirebaseFirestore.Firestore,
  collectionName: string,
): Promise<void> => {
  const collection = firestore.collection(collectionName);
  const documents = await collection.select().get();
  const batch = firestore.batch();

  for (const { id } of documents.docs) {
    batch.delete(collection.doc(id));
  }

  await batch.commit();
};

export const insertIntoCollection = async <T extends object>(
  firestore: FirebaseFirestore.Firestore,
  collectionName: string,
  ...documents: {
    id: string;
    data: T;
  }[]
): Promise<void> => {
  const collection = firestore.collection(collectionName);
  const batch = firestore.batch();

  documents.forEach(({ id, data }) => batch.set(collection.doc(id), data));

  await batch.commit();
};

export const getFromCollection = async <T extends object>(
  firestore: FirebaseFirestore.Firestore,
  collectionName: string,
): Promise<T[]> => {
  const documents = await firestore.collection(collectionName).get();

  const data = documents.docs.map((item) => item.data() as T);

  return data;
};
