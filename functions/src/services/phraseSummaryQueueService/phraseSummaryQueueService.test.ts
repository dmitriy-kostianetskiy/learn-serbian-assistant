import { PubSub, Topic } from '@google-cloud/pubsub';
import {
  PhraseSummaryQueueService,
  getPhraseSummaryQueueService,
} from './phraseSummaryQueueService';
import { GeneratePhraseSummaryPayload } from '../../model/generatePhraseSummaryPayload';
import { PubSubTopic } from '../../consts/pubSubTopic';

describe('PhraseSummaryQueueService', () => {
  let pubSub: PubSub;
  let topic: Topic;
  let service: PhraseSummaryQueueService;

  beforeEach(() => {
    topic = {
      publishMessage: jest.fn(),
    } as unknown as Topic;

    pubSub = {
      topic: jest.fn(() => topic),
    } as unknown as PubSub;

    service = getPhraseSummaryQueueService({ pubSub });
  });

  it('should add payload to the correct topic', async () => {
    // Arrange
    const payload: GeneratePhraseSummaryPayload = {
      userId: 0,
      chatId: 0,
      messageId: 0,
      userDetails: {},
      text: 'foo bar',
    };

    // Act
    await service.add(payload);

    // Assert
    expect(pubSub.topic).toHaveBeenCalledWith(PubSubTopic.PhraseSummary);
    expect(topic.publishMessage).toHaveBeenCalledWith({ json: payload });
  });
});
