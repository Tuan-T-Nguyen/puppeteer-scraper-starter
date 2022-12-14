import { consume } from './utils/scraper-queue';
import {
  updateTransactionToDone,
  updateTransactionToProcessing,
} from './utils/scraper-transaction';
import { getLinksByQuery } from './utils/scrapper';

(async () => {
  await consume(async (item) => {
    await updateTransactionToProcessing(item.transactionId.toString());
    const links = await getLinksByQuery(item.query);
    await updateTransactionToDone(item.transactionId.toString(), {
      query: item.query,
      links,
      took: (Date.now() - item.transactionId) / 1000,
    });
  });
})();
