import { PubSub } from '@google-cloud/pubsub';
import { PubSubTopic } from '../../consts/pubSubTopic';
import { GeneratePhraseSummaryPayload } from '../../model/generatePhraseSummaryPayload';

export interface PhraseSummaryQueueService {
  add(payload: GeneratePhraseSummaryPayload): Promise<void>;
}

export const getPhraseSummaryQueueService = ({
  pubSub,
}: {
  pubSub: PubSub;
}): PhraseSummaryQueueService => {
  return {
    async add(payload) {
      const topic = PubSubTopic.PhraseSummary;

      console.log(`Attempting to add request to the topic ${topic}`, payload);

      await pubSub.topic(topic).publishMessage({
        json: payload,
      });

      console.log(`Request added to the topic ${topic}`, payload);
    },
  };
};
