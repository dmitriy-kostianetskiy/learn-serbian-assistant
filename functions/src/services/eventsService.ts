import { AssistantEvent } from '../model/events';
import { v4 as uuid } from 'uuid';

export interface EventService {
  add(event: AssistantEvent): Promise<void>;
}

export const getEventsService = (
  { firestore }: { firestore: FirebaseFirestore.Firestore },
  collectionName = 'user',
): EventService => {
  const collection = firestore.collection(collectionName);

  return {
    async add(event) {
      const id = uuid();

      console.log(`Event '${id}' adding: ${event.type}`);

      const documentRef = collection.doc(id);
      await documentRef.set(event);

      console.log(`Event '${id}' added: ${event.type}`);
    }
  };
};
