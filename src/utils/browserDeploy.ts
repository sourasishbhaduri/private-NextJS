"use client";

import { WalletState } from '../types';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
// Dynamic imports will be used for providers that depend on node/browser specific APIs to prevent SSR crashes
import type { ZKConfigProvider } from '@midnight-ntwrk/midnight-js-types';

export interface OrganDonorPrivateState {
  secretDonorKey: Uint8Array;
  secretDonorAge: number;
  secretBloodType: number;
  secretOrganPledge: number;
  secretClearanceHash: Uint8Array;
}

const initialPrivateState: OrganDonorPrivateState = {
  secretDonorKey: new Uint8Array(32),
  secretDonorAge: 18,
  secretBloodType: 1,
  secretOrganPledge: 1,
  secretClearanceHash: new Uint8Array(32).fill(1),
};

class FetchZkConfigProvider implements ZKConfigProvider {
  constructor(private basePath: string) {}

  async getZKIR(contractName: string): Promise<Uint8Array> {
    const res = await fetch(`${this.basePath}/${contractName}.zkir`);
    if (!res.ok) throw new Error(`Failed to fetch ZKIR: ${res.statusText}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getProverKey(contractName: string): Promise<Uint8Array> {
    const res = await fetch(`${this.basePath}/${contractName}.pk`);
    if (!res.ok) throw new Error(`Failed to fetch Prover Key: ${res.statusText}`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getVerifierKey(contractName: string): Promise<Uint8Array> {
    const res = await fetch(`${this.basePath}/${contractName}.vk`);
    if (!res.ok) throw new Error(`Failed to fetch Verifier Key: ${res.statusText}`);
    return new Uint8Array(await res.arrayBuffer());
  }
}

export async function createBrowserProviders(walletCtx: WalletState) {
  if (!walletCtx.api) {
    throw new Error('Wallet API is not connected.');
  }
  
  if (!walletCtx.configuration) {
    throw new Error('Wallet configuration is missing.');
  }

  const { indexerUri, indexerWsUri } = walletCtx.configuration;
  
  // Proof server: try to get from config, fallback to local docker container if testing locally
  const proofServerUri = walletCtx.configuration.proverServerUri || 'http://127.0.0.1:6300';
  
  // The DApp Connector Wallet Provider API is exactly what midnight-js needs
  // The `walletCtx.api` (ConnectedAPI) implements the WalletProvider methods like balanceTransaction, submitTransaction etc.
  const walletProvider = {
    getCoinPublicKey: () => walletCtx.coinPublicKey,
    // ConnectedAPI provides `balanceTransaction` and `submitTransaction`. 
    // `midnight-js-types` WalletProvider expects `balanceTx` and `submitTx`. 
    // Let's proxy them if necessary.
    balanceTx: async (tx: any, ttl?: Date) => {
       // v4 might expose `balanceTransaction` or `balanceTx`.
       // We'll dynamically route it just in case.
       if (typeof walletCtx.api.balanceTx === 'function') {
           return walletCtx.api.balanceTx(tx, ttl);
       }
       if (typeof walletCtx.api.balanceTransaction === 'function') {
           return walletCtx.api.balanceTransaction(tx, ttl);
       }
       throw new Error("Wallet API does not have balanceTx or balanceTransaction method.");
    },
    submitTx: async (tx: any) => {
       if (typeof walletCtx.api.submitTx === 'function') {
           return walletCtx.api.submitTx(tx);
       }
       if (typeof walletCtx.api.submitTransaction === 'function') {
           return walletCtx.api.submitTransaction(tx);
       }
       throw new Error("Wallet API does not have submitTx or submitTransaction method.");
    }
  };

  const zkConfigProvider = new FetchZkConfigProvider('/contracts/organ-donor-registry');
  
  const accountId = walletCtx.address!;
  const privateStatePassword = 'Browser-Local-Password-123!';

  // We are importing BrowserLevel dynamically to avoid SSR issues
  const { BrowserLevel } = await import('browser-level');
  const { levelPrivateStateProvider } = await import('@midnight-ntwrk/midnight-js-level-private-state-provider');

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'organ-donor-registry-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
      levelFactory: (name: string) => new BrowserLevel(name) as any,
    }),
    publicDataProvider: indexerPublicDataProvider(indexerUri, indexerWsUri),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(proofServerUri, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

export async function deployOrganDonorRegistry(walletCtx: WalletState) {
  const providers = await createBrowserProviders(walletCtx);
  
  // Dynamically import the compiled contract to avoid Next.js SSR issues with BigInt or compact wasm
  const { Contract, ledger } = await import('../../contracts/managed/organ-donor-registry/contract/index.js');
  
  console.log('Deploying contract via Browser...');

  const organDonorContract = new Contract(initialPrivateState);

  try {
    const deployedContract = await deployContract(providers, {
      privateStateKey: 'organDonorRegistryPrivateState',
      contract: organDonorContract,
      initialPrivateState,
    });
    
    return deployedContract.deployTxData.public.contractAddress;
  } catch (error: any) {
    console.error('Deployment failed:', error);
    throw new Error(`Deployment failed: ${error.message}`);
  }
}
