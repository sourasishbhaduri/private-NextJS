"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WalletState } from '../types';
import { WalletModal } from '../components/WalletModal';

interface WalletContextType {
  wallet: WalletState;
  setWallet: React.Dispatch<React.SetStateAction<WalletState>>;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    walletName: null,
    tNightBalance: null,
    dustBalance: null,
    network: 'preview',
    error: null,
  });

  return (
    <WalletContext.Provider value={{ wallet, setWallet, isWalletModalOpen, setIsWalletModalOpen }}>
      {children}
      <WalletModal />
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
