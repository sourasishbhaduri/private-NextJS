"use client";

import { WalletState } from '../types';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
// Dynamic imports will be used for providers that depend on node/browser specific APIs to prevent SSR crashes
import type { ZKConfigProvider } from '@midnight-ntwrk/midnight-js-types';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

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

  private parseName(contractName: string) {
    const parts = contractName.split('#');
    return parts.length > 1 ? parts[1] : parts[0];
  }

  async getZKIR(contractName: string): Promise<Uint8Array> {
    const name = this.parseName(contractName);
    const res = await fetch(`${this.basePath}/zkir/${name}.zkir`);
    if (!res.ok) throw new Error(`Failed to fetch ZKIR: ${res.statusText} (${res.url})`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getProverKey(contractName: string): Promise<Uint8Array> {
    const name = this.parseName(contractName);
    const res = await fetch(`${this.basePath}/keys/${name}.prover`);
    if (!res.ok) throw new Error(`Failed to fetch Prover Key: ${res.statusText} (${res.url})`);
    return new Uint8Array(await res.arrayBuffer());
  }

  async getVerifierKey(contractName: string): Promise<Uint8Array> {
    const name = this.parseName(contractName);
    const res = await fetch(`${this.basePath}/keys/${name}.verifier`);
    if (!res.ok) throw new Error(`Failed to fetch Verifier Key: ${res.statusText} (${res.url})`);
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
    coinPublicKey: walletCtx.coinPublicKey,
    getCoinPublicKey: () => walletCtx.coinPublicKey,
    getEncryptionPublicKey: () => {
      if (!walletCtx.encryptionPublicKey) {
        throw new Error("Missing encryption public key. Please disconnect and reconnect your wallet.");
      }
      return walletCtx.encryptionPublicKey;
    },
    balanceTx: async (tx: any, ttl?: Date) => {
       const { toHex, fromHex } = await import('@midnight-ntwrk/midnight-js-utils');
       let txStr;
       if (typeof tx === 'string') {
         txStr = tx;
       } else if (tx.serialize) {
         txStr = toHex(tx.serialize());
       } else {
         txStr = toHex(tx);
       }
       
       let balancedTxStr;
       // Midnight DApp Connector API v4 uses balanceUnsealedTransaction or balanceTransaction depending on implementation
       try {
         if (typeof walletCtx.api.balanceUnsealedTransaction === 'function') {
             console.log('[Deployment] Calling balanceUnsealedTransaction...');
             const res = await walletCtx.api.balanceUnsealedTransaction(txStr);
             console.log('[Deployment] balanceUnsealedTransaction success:', res);
             balancedTxStr = typeof res === 'string' ? res : res.tx;
         } else if (typeof walletCtx.api.balanceTransaction === 'function') {
             console.log('[Deployment] Calling balanceTransaction...');
             const res = await walletCtx.api.balanceTransaction(txStr, walletCtx.coinPublicKey);
             console.log('[Deployment] balanceTransaction success:', res);
             balancedTxStr = typeof res === 'string' ? res : res.tx;
         } else if (typeof walletCtx.api.balanceTx === 'function') {
             console.log('[Deployment] Calling balanceTx...');
             const res = await walletCtx.api.balanceTx(txStr, walletCtx.coinPublicKey);
             console.log('[Deployment] balanceTx success:', res);
             balancedTxStr = typeof res === 'string' ? res : res.tx;
         } else {
             throw new Error("Wallet API does not have balanceUnsealedTransaction, balanceTx or balanceTransaction method. API provided: " + Object.keys(walletCtx.api).join(', '));
         }
       } catch (apiErr) {
         console.error('[Deployment] Error inside balanceTx API call:', apiErr);
         throw apiErr;
       }

       const bytes = fromHex(balancedTxStr);
       return {
         serialize: () => bytes,
       };
    },
    submitTx: async (tx: any) => {
       const { toHex } = await import('@midnight-ntwrk/midnight-js-utils');
       let txStr;
       if (typeof tx === 'string') {
         txStr = tx;
       } else if (tx.serialize) {
         txStr = toHex(tx.serialize());
       } else {
         txStr = toHex(tx);
       }
       
       console.log('[Deployment] Submitting transaction...');
       if (typeof walletCtx.api.submitTransaction === 'function') {
           const res = await walletCtx.api.submitTransaction(txStr); 
   if (res && typeof res === 'string') return res;
   if (res && (res.tx || res.txHash || res.identifier)) return res.tx || res.txHash || res.identifier;
   console.log('[Deployment] submitTx returned undefined. Extracting ID from tx object...', tx);
   if (tx && tx.id) return toHex(tx.id);
   if (tx && tx.hash) return typeof tx.hash === 'function' ? toHex(tx.hash()) : toHex(tx.hash);
   console.warn('[Deployment] Could not find tx.id! Returning a dummy hash so indexer can at least try (or timeout).');
   return '0000000000000000000000000000000000000000000000000000000000000000';
       } else if (typeof walletCtx.api.submitTx === 'function') {
           const res = await walletCtx.api.submitTx(txStr); 
   if (res && typeof res === 'string') return res;
   if (res && (res.tx || res.txHash || res.identifier)) return res.tx || res.txHash || res.identifier;
   console.log('[Deployment] submitTx returned undefined. Extracting ID from tx object...', tx);
   if (tx && tx.id) return toHex(tx.id);
   if (tx && tx.hash) return typeof tx.hash === 'function' ? toHex(tx.hash()) : toHex(tx.hash);
   console.warn('[Deployment] Could not find tx.id! Returning a dummy hash so indexer can at least try (or timeout).');
   return '0000000000000000000000000000000000000000000000000000000000000000';
       } else {
           throw new Error("Wallet API does not have submitTx or submitTransaction method.");
       }
    }
  };

  const zkConfigProvider = new FetchZkConfigProvider('/contracts/organ-donor-registry');
  
  const accountId = walletCtx.address!;
  const privateStatePassword = 'Browser-Local-Password-123!';

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
  setNetworkId(walletCtx.network || 'preview');
  const providers = await createBrowserProviders(walletCtx);
  
  // Dynamically import the compiled contract to avoid Next.js SSR issues with BigInt or compact wasm
  const { Contract, ledger } = await import('../../contracts/managed/organ-donor-registry/contract/index.js');
  
  console.log('Deploying contract via Browser...');

    const witnesses = {
    secretDonorAge: (context: any) => [context.privateState, BigInt(context.privateState.secretDonorAge)],
    secretBloodType: (context: any) => [context.privateState, BigInt(context.privateState.secretBloodType)],
    secretOrganPledge: (context: any) => [context.privateState, BigInt(context.privateState.secretOrganPledge)],
    secretClearanceHash: (context: any) => [context.privateState, context.privateState.secretClearanceHash],
  };

  const { CompiledContract } = await import('@midnight-ntwrk/midnight-js-protocol/compact-js');
  
  const compiledContract = (CompiledContract as any).make('organ-donor-registry', Contract).pipe(
    (CompiledContract as any).withWitnesses(witnesses)
  );

  // Diagnostic Logging
  console.log("─── DEPLOYMENT DIAGNOSTICS ───");
  console.log(`[Deployment] Network ID: ${walletCtx.network}`);
  console.log(`[Deployment] Coin Public Key length: ${walletCtx.coinPublicKey?.length}`);
  console.log(`[Deployment] Encryption Public Key length: ${walletCtx.encryptionPublicKey?.length}`);
  console.log(`[Deployment] Indexer URI length: ${walletCtx.configuration?.indexerUri?.length}`);
  console.log(`[Deployment] privateStateId: 'organDonorRegistryPrivateState'`);
  console.log(`[Deployment] Compiled Contract valid: ${!!compiledContract}`);
  console.log(`[Deployment] Initial Private State valid: ${!!initialPrivateState.secretClearanceHash}`);
  console.log("──────────────────────────────");

  try {
    const deployedContract = await deployContract(providers, {
      privateStateId: 'organDonorRegistryPrivateState',
      compiledContract,
      args: [],
      initialPrivateState,
    });
    
    return deployedContract.deployTxData.public.contractAddress;
  } catch (error: any) {
    console.error('Deployment failed:', error);
    throw new Error(`Deployment failed: ${error.message}`);
  }
}
