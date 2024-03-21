'use client';

import useTxStore from '@/stores/txStore';
import useStore from '@/stores/useStore';
import { EvmChains, SignProtocolClient, SpMode } from '@ethsign/sp-sdk';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Breadcrumb, Button, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiHome } from 'react-icons/hi';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {
  mainnet,
  opBNB,
  opBNBTestnet,
  polygon,
  polygonMumbai,
  scroll,
  scrollSepolia,
  zetachain,
  zetachainAthensTestnet,
} from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import CreatedSchemaList from './CreatedSchemaList';

export const availableChains = [
  mainnet, // line-break
  polygonMumbai,
  zetachainAthensTestnet,
  opBNBTestnet,
  zetachain,
  polygon,
  opBNB,
  scrollSepolia,
  scroll,
];

type TAvailableChainIds = (typeof availableChains)[number]['id'];

export const chainIdAndSpChainNameMap = {
  [mainnet.id]: EvmChains.mainnet,
  [polygonMumbai.id]: EvmChains.polygonMumbai,
  [zetachainAthensTestnet.id]: EvmChains.zetachainAthensTestnet,
  [opBNBTestnet.id]: EvmChains.opBNBTestnet,
  [zetachain.id]: EvmChains.zetachainMainnet,
  [polygon.id]: EvmChains.polygon,
  [opBNB.id]: EvmChains.opBNB,
  [scrollSepolia.id]: EvmChains.scrollSepolia,
  [scroll.id]: EvmChains.scroll,
};

export default function PageContent() {
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const txStore = useStore(useTxStore, (state) => state);

  const [loading, setLoading] = useState(false);

  const [schemaStr, setSchemaStr] = useState('[{ "name": "record", "type": "string" }]');
  const [selectedChainId, setSelectedChainId] = useState<TAvailableChainIds>(mainnet.id);

  useEffect(() => {
    if (localStorage.getItem('selectedChainId')) {
      const storedChainId = Number(localStorage.getItem('selectedChainId')) as TAvailableChainIds;
      if (availableChains.find((chain) => chain.id === storedChainId)) {
        setSelectedChainId(storedChainId);
      }
    }
  }, []);

  const handleCreateSchema = async () => {
    if (loading) {
      return;
    }

    let parsedSchemaData: any;
    try {
      parsedSchemaData = JSON.parse(schemaStr);
    } catch (err) {
      console.error('invalid json: ', err);
      toast.error('Invalid JSON');
      return;
    }

    if (!selectedChainId) {
      toast.error('Please select a chain.');
      return;
    }

    if (!confirm('You are about to register this schema?')) {
      console.error('user cancelled');
      return;
    }

    if (!chainIdAndSpChainNameMap[selectedChainId]) {
      console.error('chain not found in chainIdAndSpChainNameMap');
      toast.error('Selected chain unsupported');
      return;
    }

    setLoading(true);

    const spClient = new SignProtocolClient(SpMode.OnChain, {
      chain: chainIdAndSpChainNameMap[selectedChainId],
    });

    console.log('spClient: ', spClient);

    try {
      // Create a schema
      const { schemaId, txHash } = await spClient.createSchema({
        name: 'Simple Voting Schema',
        data: parsedSchemaData,
      });

      console.log('createSchema res.schemaId: ', schemaId);
      console.log('createSchema res.txHash: ', txHash);

      txStore?.add({
        chain_id: selectedChainId,
        hash: txHash!,
        created_at: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('createSchema err: ', err);
      console.error('createSchema JSON.stringify(err): ', JSON.stringify(err));
      toast.error(err?.message || 'Error creating schema. Open browser console for more details.');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-screen-lg space-y-4 py-10">
        <Breadcrumb className="bg-gray-50 px-5 py-3 dark:bg-gray-800">
          <Breadcrumb.Item href="/" icon={HiHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item>Register Sign Protocol Schema</Breadcrumb.Item>
        </Breadcrumb>

        <div>
          <div className="text-3xl font-bold">Register Sign Protocol Schema</div>
        </div>

        <div>My wallet address: {address}</div>
        <div>
          {!isConnected ? (
            <button
              className="mb-2 me-2 inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={() => {
                if (loading) {
                  return;
                }
                connect({
                  chainId: polygonMumbai.id,
                  connector: injected(),
                });
              }}
            >
              <Icon icon="logos:metamask-icon" className="-ms-1 me-2 h-5 w-6" />
              Connect with MetaMask
            </button>
          ) : (
            <button
              className="mb-2 me-2 inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={() => {
                if (loading) {
                  return;
                }
                disconnect();
              }}
            >
              <Icon icon="logos:metamask-icon" className="-ms-1 me-2 h-5 w-6" />
              Disconnect my wallet
            </button>
          )}
        </div>

        <hr className="border-t-neutral-300" />

        <div>
          <div>
            <label htmlFor="field_schema" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Schema (JSON string)
            </label>
            <Textarea
              id="field_schema"
              className="min-h-[200px]"
              placeholder='eg: [{ "name": "record", "type": "string" }]'
              rows={4}
              value={schemaStr}
              onChange={(e) => setSchemaStr(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="field_chain" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Chain
          </label>
          <div className="flex flex-wrap gap-1">
            {availableChains.map((chain) => (
              <button
                key={chain.id}
                className={`rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs font-bold disabled:opacity-60 ${chain.id === selectedChainId ? 'border-sky-500 text-sky-500 ring-2 ring-sky-500' : ''}`}
                onClick={() => {
                  if (loading) {
                    return;
                  }
                  localStorage.setItem('selectedChainId', chain.id.toString());
                  setSelectedChainId(chain.id);
                }}
                disabled={loading}
              >
                {chain.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Button
            color="blue"
            onClick={handleCreateSchema}
            disabled={!Boolean(isConnected && schemaStr && selectedChainId && !loading)}
          >
            create schema
          </Button>
        </div>

        <hr className="border-t-neutral-300" />

        <div>
          <CreatedSchemaList />
        </div>
      </div>
    </main>
  );
}
