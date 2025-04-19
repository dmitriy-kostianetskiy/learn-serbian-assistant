import { PubSub, Topic } from '@google-cloud/pubsub';
import {
  SummaryQueueService,
  getSummaryQueueService,
} from './summary-queue-service';
import { GenerateSummaryPayload } from '../model/generateSummaryPayload';
import { PubSubTopic } from '../consts/pubSubTopic';

describe('SummaryQueueService', () => {
  let pubSub: PubSub;
  let topic: Topic;
  let service: SummaryQueueService;

  beforeEach(() => {
    topic = {
      publishMessage: jest.fn(),
    } as unknown as Topic;

    pubSub = {
      topic: jest.fn(() => topic),
    } as unknown as PubSub;

    service = getSummaryQueueService({ pubSub });
  });

  it('should add payload to the correct topic', async () => {
    // Arrange
    const payload: GenerateSummaryPayload = {
      userId: 0,
      chatId: 0,
      messageId: 0,
      userDetails: {},
      text: 'foo bar',
    };

    // Act
    await service.add(payload);

    // Assert
    expect(pubSub.topic).toHaveBeenCalledWith(PubSubTopic.Summary);
    expect(topic.publishMessage).toHaveBeenCalledWith({ json: payload });
  });
});
