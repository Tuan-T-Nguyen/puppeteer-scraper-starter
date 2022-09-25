import { ISearchResult, ITransaction } from './interfaces';
import getRedisClient from './redis';

export async function addTransaction(id: string): Promise<void> {
  const redisClient = await getRedisClient();

  await redisClient.set(
    id,
    JSON.stringify({ status: 'ON_QUEUE' } as ITransaction),
    { EX: 15 * 60 },
  );
}

export async function updateTransactionToProcessing(id: string): Promise<void> {
  const redisClient = await getRedisClient();

  await redisClient.set(
    id,
    JSON.stringify({ status: 'PROCESSING' } as ITransaction),
    { KEEPTTL: true },
  );
}

export async function updateTransactionToDone(
  id: string,
  result: ISearchResult,
): Promise<void> {
  const redisClient = await getRedisClient();

  await redisClient.set(
    id,
    JSON.stringify({ status: 'DONE', data: result } as ITransaction),
    { KEEPTTL: true },
  );
}

export async function getTransactionResult(id: string): Promise<ITransaction> {
  const redisClient = await getRedisClient();
  const valueString = await redisClient.get(id);

  if (!valueString) {
    throw new Error('Transaction not found');
  }

  return JSON.parse(valueString) as ITransaction;
}
