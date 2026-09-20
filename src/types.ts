export type NetworkId = 'undeployed' | 'preview';

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: NetworkId;
  tNightBalance: bigint | null;
  dustBalance: bigint | null;
  syncing?: boolean;
  walletName?: string | null;
  providerType?: 'lace' | 'seed' | 'other';
  error?: string | null;
  api?: any; // Raw DApp connector API object from the wallet
}

export interface DonorFormData {
  secretPassphrase: string;  // ZK private witness — never sent on-chain
  age: number;               // ZK private witness — proves >= 18 without revealing exact value
  bloodType: number;         // 1-8 code; contributes to anonymous blood supply aggregate
  organPledgeBitmask: number;// Bitmask of pledged organs
  medicalClearanceSeed: string; // Cryptographic clearance token seed
}

export interface PublicLedgerData {
  totalDonors: number;
  bloodGroupCounts: Record<number, number>;
  lastUpdated: Date | null;
}

export interface VerificationResult {
  commitment: string;
  eligible: boolean;
  timestamp: Date;
}

export interface RegistrationResult {
  success: boolean;
  commitment?: string;
  txHash?: string;
  error?: string;
  simulated?: boolean;
}
