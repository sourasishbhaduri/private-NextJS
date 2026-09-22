"use client";

import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { DonorRegistrationForm } from '../../components/DonorRegistrationForm';
import { WalletState } from '../../types';
import { registerDonorOnChain } from '../../utils/contractInteraction';

export default function RegisterPage() {
  const { wallet, setIsWalletModalOpen } = useWallet();
    const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <div className="app-container">
      <Navbar />
      

      <main className="main-content" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}>
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <div className="saas-card" style={{ padding: '0', overflow: 'hidden' }}>
          {wallet.connected ? (
            <DonorRegistrationForm
              isSubmitting={isSubmitting}
              onRegister={async (data) => {
                setIsSubmitting(true);
                try {
                  const result = await registerDonorOnChain(
                    data,
                    wallet.api,
                    wallet.address || 'unknown'
                  );
                  return result;
                } catch (err: any) {
                  return { success: false, error: err?.message || 'Unknown error during registration' };
                } finally {
                  setIsSubmitting(false);
                }
              }}
            />
          ) : (
            <div style={{ padding: '60px 40px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Connect Wallet to Register</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                You need to connect your 1AM Wallet or Midnight Lace Wallet to register as a donor.
              </p>
              <button onClick={() => setIsWalletModalOpen(true)} className="btn-saas-primary">
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
