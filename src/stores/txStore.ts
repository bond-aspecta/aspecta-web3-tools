import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TTx = { chain_id: number; hash: string; created_at: string };

const useTxStore = create<{
  txs: TTx[];
  add: (tx: TTx) => void;
}>()(
  persist(
    (set) => ({
      txs: [],
      add: (tx) => set((state) => ({ txs: [tx, ...state.txs] })),
    }),
    {
      name: 'tx-storage',
    }
  )
);

export default useTxStore;
