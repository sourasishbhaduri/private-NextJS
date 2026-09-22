"use client";

// Utilities for Midnight DApp Connector API v4
import type { InitialAPI, ConnectedAPI, Configuration } from '@midnight-ntwrk/dapp-connector-api';

export interface DetectedWallet {
  id: string;
  name: string;
  icon?: string;
  apiVersion?: string;
  provider: InitialAPI;
}

declare global {
  interface Window {
    midnight?: Record<string, InitialAPI>;
  }
}

/**
 * Detects injected Midnight-compatible wallets available in the browser.
 * Follows the v4 connector API which injects InitialAPI into window.midnight.
 */
export function detectMidnightWallets(): DetectedWallet[] {
  const wallets: DetectedWallet[] = [];

  if (typeof window === 'undefined' || !window.midnight) {
    return wallets;
  }

  for (const key of Object.keys(window.midnight)) {
    const provider = window.midnight[key];
    if (provider && typeof provider.connect === 'function') {
      wallets.push({
        id: key,
        name: provider.name || key,
        icon: provider.icon,
        apiVersion: provider.apiVersion,
        provider,
      });
    }
  }

  return wallets;
}

import { WalletState } from '../types';

/**
 * Connects to the 1AM Midnight Wallet via DApp Connector API v4
 * Specifically enforces connection to the "preview" network.
 */
export async function connect1AMWallet(): Promise<WalletState> {
  if (typeof window === 'undefined') {
    throw new Error('Browser environment not detected.');
  }

  // 1. Discover available wallets and identify 1AM
  const wallets = detectMidnightWallets();
  const targetWallet = wallets.find((w) => w.id === '1am');

  if (!targetWallet) {
    throw new Error(
      '1AM Wallet not detected. Install/unlock 1AM and refresh.'
    );
  }

  // 2. Request connection to: Preview
  console.log(`[1AM] Connector detected. API version: ${targetWallet.apiVersion || 'unknown'}`);
  console.log(`[1AM] Requesting connection to Preview...`);

  let connectedApi: ConnectedAPI;
  try {
    connectedApi = await targetWallet.provider.connect('preview');
  } catch (err: any) {
    throw new Error(`1AM Wallet rejected the connection. Please open your 1AM extension, go to Settings -> Connected DApps, click the Disconnect button for localhost, refresh the page, and try again. Detailed error: ${err.message || err}`);
  }

  console.log(`[1AM] Wallet connection approved!`);

  // 3. Obtain configuration
  const configuration = await connectedApi.getConfiguration();
  console.log(`[1AM] Wallet configuration received for network: ${configuration.networkId}`);

  if (configuration.networkId !== 'preview' && configuration.networkId !== 'testnet') {
      throw new Error(`Wallet connected to wrong network: ${configuration.networkId}. Expected: preview.`);
  }

  // 4. Retrieve Addresses & Coin Public Key
  const shieldedAddresses = await connectedApi.getShieldedAddresses();
  const unshieldedInfo = await connectedApi.getUnshieldedAddress();
  
  if (!shieldedAddresses || !shieldedAddresses.shieldedAddress) {
      throw new Error("Could not retrieve shielded address from connected wallet.");
  }
  
  const address = shieldedAddresses.shieldedAddress || unshieldedInfo.unshieldedAddress;
  const coinPublicKey = shieldedAddresses.shieldedCoinPublicKey;
  const encryptionPublicKey = shieldedAddresses.shieldedEncryptionPublicKey;

  if (!coinPublicKey) {
      throw new Error("Wallet did not return a valid coin public key.");
  }
  
  if (!encryptionPublicKey) {
      throw new Error("Wallet did not return a valid encryption public key. Please ensure your wallet is fully initialized.");
  }

  // 5. Retrieve Balances
  const unshieldedBalances = await connectedApi.getUnshieldedBalances();
  const dustInfo = await connectedApi.getDustBalance();

  // Handle older vs newer token type mappings (tNight vs NIGHT vs Unshielded etc)
  let tNightBalance = 0n;
  for (const [key, value] of Object.entries(unshieldedBalances)) {
      if (key.toLowerCase().includes('night')) {
          tNightBalance = value;
          break;
      }
  }

  const dustBalance = dustInfo?.balance ?? 0n;

  return {
    connected: true,
    address,
    coinPublicKey,
    encryptionPublicKey,
    walletName: targetWallet.name,
    network: configuration.networkId as 'preview',
    tNightBalance,
    dustBalance,
    api: connectedApi,
    configuration,
    providerType: '1am'
  };
}
