"use client";

import React, { useState, useEffect } from 'react';
import { X, Wallet, ShieldCheck, Download, AlertTriangle, Cpu, CheckCircle2 } from 'lucide-react';
import { detectMidnightWallets, connect1AMWallet, DetectedWallet } from '../utils/midnightWallet';
import { useWallet } from '../contexts/WalletContext';

export const WalletModal: React.FC = () => {
  const { wallet, setWallet, isWalletModalOpen, setIsWalletModalOpen } = useWallet();
  const [detectedWallets, setDetectedWallets] = useState<DetectedWallet[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isOpen = isWalletModalOpen;
  const onClose = () => setIsWalletModalOpen(false);

  useEffect(() => {
    if (isOpen) {
      const wallets = detectMidnightWallets();
      setDetectedWallets(wallets);
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect1AM = async () => {
    // Close our modal immediately so that if 1AM injects a DOM modal, our backdrop doesn't block it!
    onClose();
    
    try {
      const res = await connect1AMWallet();
      setWallet({
        connected: true,
        address: res.address,
        walletName: res.walletName,
        tNightBalance: res.tNightBalance,
        dustBalance: res.dustBalance,
        network: res.network,
        error: null,
        api: res.api as any, 
        configuration: res.configuration as any,
        coinPublicKey: res.coinPublicKey,
        encryptionPublicKey: res.encryptionPublicKey
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to connect to 1AM Wallet.');
    }
  };

  const has1AM = detectedWallets.some(w => w.id === '1am');

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="saas-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '28px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          background: '#fff'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '12px', color: '#f97316' }}>
            <Wallet size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Connect 1AM Wallet</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Authorize 1AM Wallet to deploy and interact on Midnight Preview
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <AlertTriangle size={18} color="#f97316" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Wallet Connection UI */}
        <div>
          {has1AM ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleConnect1AM}
                disabled={isConnecting}
                className="saas-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  background: 'rgba(16, 185, 129, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} color="#f97316" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>1AM Midnight Wallet</h4>
                    <span style={{ fontSize: '0.75rem', color: '#34d399' }}>● Detected via DApp Connector</span>
                  </div>
                </div>
                {isConnecting ? (
                  <Cpu size={20} className="animate-spin" color="#f97316" />
                ) : (
                  <CheckCircle2 size={20} color="#f97316" />
                )}
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(20, 184, 166, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <AlertTriangle size={24} color="#14b8a6" />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
                1AM Wallet Not Detected
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                We couldn't detect the 1AM Wallet extension in your browser window. Install the 1AM wallet and unlock it.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                     setDetectedWallets(detectMidnightWallets());
                  }}
                  disabled={isConnecting}
                  className="btn-saas-primary"
                  style={{ justifyContent: 'center', padding: '12px' }}
                >
                  Retry Extension Detection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
