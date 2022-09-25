import env from './env';
import getChannel from './rabbitmq';
import { IQueueItem } from './interfaces';

export async function sendQueryToQueue(item: IQueueItem): Promise<boolean> {
  const channel = await getChannel(env.rabbitMQScraperQueue);
  const message = JSON.stringify(item);
  return channel.sendToQueue(env.rabbitMQScraperQueue, Buffer.from(message));
}

export async function consume(onQuery: (item: IQueueItem) => Promise<void>) {
  const channel = await getChannel(env.rabbitMQScraperQueue);
  channel.consume(env.rabbitMQScraperQueue, async (message) => {
    try {
      if (!message) {
        return;
      }
      const item = JSON.parse(message.content.toString()) as IQueueItem;

      await onQuery(item);
    } finally {
      if (message) {
        channel.ack(message);
      }
    }
  });
}
