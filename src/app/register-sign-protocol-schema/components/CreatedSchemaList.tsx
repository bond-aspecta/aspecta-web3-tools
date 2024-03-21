import useTxStore from '@/stores/txStore';
import useStore from '@/stores/useStore';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { availableChains } from './PageContent';

export default function CreatedSchemaList() {
  const txStore = useStore(useTxStore, (state) => state);

  // render this component every minute
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('CreatedSchemaList interval');
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Schema you created</h2>
      <ul className="list-inside list-disc space-y-1 text-gray-500 dark:text-gray-400">
        {txStore?.txs.map((tx) => (
          <li key={tx.hash} className="flex items-center justify-between">
            <div>{availableChains.find((e) => e.id === tx.chain_id)?.name}:</div>
            <a
              href={`${availableChains.find((e) => e.id === tx.chain_id)?.blockExplorers.default.url}/tx/${tx.hash}`}
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              target="_blank"
              title={tx.hash}
            >
              {tx.hash.slice(0, 8)}...{tx.hash.slice(-8)}
            </a>
            <div>{DateTime.now().diff(DateTime.fromISO(tx.created_at)).toFormat('yyyy/MM/dd hh:mm')}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
