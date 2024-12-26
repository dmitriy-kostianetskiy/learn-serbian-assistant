import { FieldValue } from 'firebase-admin/firestore';
import { AssistantEvent } from '../model/events';
import { randomUUID } from 'crypto';

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
      const id = randomUUID();

      console.log(`Event '${id}' adding: ${event.type}`);

      const ref = collection.doc(id);

      await ref.set({
        ...event,
        createdAt: FieldValue.serverTimestamp(),
      });

      console.log(`Event '${id}' added: ${event.type}`);
    },
  };
};
