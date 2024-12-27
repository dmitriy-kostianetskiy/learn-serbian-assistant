import { PubSub } from '@google-cloud/pubsub';
import { PubSubTopic } from '../consts/pubSubTopic';
import { GenerateSummaryPayload } from '../model/generateSummaryPayload';

export interface SummaryQueueService {
  add(payload: GenerateSummaryPayload): Promise<void>;
}

export const getSummaryQueueService = ({
  pubSub,
}: {
  pubSub: PubSub;
}): SummaryQueueService => {
  return {
    async add(payload) {
      const topic = PubSubTopic.Summary;

      console.log(`Attempting to add request to the topic ${topic}`, payload);

      await pubSub.topic(topic).publishMessage({
        json: payload,
      });

      console.log(`Request added to the topic ${topic}`, payload);
    },
  };
};
