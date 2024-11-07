import { FieldValue } from 'firebase-admin/firestore';
import { AssistantEvent } from '../model/events';
import { v4 as uuid } from 'uuid';

export interface EventService {
  add(event: AssistantEvent): Promise<void>;
}

export const getEventsService = ({
  firestore,
}: {
  firestore: FirebaseFirestore.Firestore;
}): EventService => {
  const collection = firestore.collection('events');

  return {
    async add(event) {
      const id = uuid();

      console.log(`Event '${id}' adding: ${event.type}`);

      const documentRef = collection.doc(id);
      await documentRef.set({
        ...event,
        createdAt: FieldValue.serverTimestamp(),
      });

      console.log(`Event '${id}' added: ${event.type}`);
    },
  };
};
