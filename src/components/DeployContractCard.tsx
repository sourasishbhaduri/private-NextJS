"use client";

import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Copy, Check, ExternalLink, ShieldCheck, AlertTriangle, Cpu } from 'lucide-react';

const DEFAULT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'de11c2e51425e63b2b20faf91750245d7355715ba0af8ef6c82c065674ebe23d';

export const DeployContractCard: React.FC = () => {
  const { wallet } = useWallet();
  const [contractId, setContractId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('deployedContractId');
      if (stored) return stored;
    }
    return DEFAULT_CONTRACT_ADDRESS;
  });
  const [copied, setCopied] = useState(false);
  const [showDeployForm, setShowDeployForm] = useState(false);
  const [deployState, setDeployState] = useState<'IDLE' | 'DEPLOYING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeploy = async () => {
    setDeployState('DEPLOYING');
    setErrorMessage(null);
    try {
      const { deployOrganDonorRegistry } = await import('../utils/browserDeploy');
      const deployedAddress = await deployOrganDonorRegistry(wallet);
      setContractId(deployedAddress);
      setDeployState('SUCCESS');
      setShowDeployForm(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('deployedContractId', deployedAddress);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Deployment failed');
      setDeployState('ERROR');
    }
  };

  if (!wallet.connected) {
    return null;
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        border: '1px solid rgba(249,115,22,0.3)',
        borderRadius: '24px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '280px',
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '160px', height: '160px',
        background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            {/* Live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ position: 'relative', display: 'inline-flex', width: '10px', height: '10px' }}>
                <span style={{
                  position: 'absolute', inset: 0,
                  background: '#34d399', borderRadius: '50%',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                  opacity: 0.6,
                }} />
                <span style={{
                  position: 'relative', width: '10px', height: '10px',
                  background: '#10b981', borderRadius: '50%',
                  display: 'inline-block',
                }} />
              </span>
              <span style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#34d399',
              }}>
                Live Contract Active
              </span>
            </div>
            {/* Title */}
            <h3 style={{
              margin: 0, fontSize: '18px', fontWeight: 900,
              color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <ShieldCheck size={20} style={{ color: '#f97316', flexShrink: 0 }} />
              Organ Donor Registry
            </h3>
          </div>
          <span style={{
            padding: '3px 10px',
            background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.4)',
            color: '#fb923c',
            fontSize: '11px', fontWeight: 700,
            borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}>
            Preview
          </span>
        </div>

        {/* Description */}
        <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
          Zero-Knowledge Compact circuit deployed and verified on Midnight Preview network.
        </p>

        {/* Contract address box */}
        <div style={{
          background: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '14px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#64748b',
            }}>
              Contract Address
            </span>
            <button
              onClick={handleCopy}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px',
                color: copied ? '#34d399' : '#94a3b8',
                fontSize: '11px', fontWeight: 600, padding: 0,
              }}
              title="Copy Contract Address"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{
            fontFamily: 'monospace', fontSize: '12px',
            color: '#fb923c', wordBreak: 'break-all', lineHeight: 1.6,
            userSelect: 'all',
          }}>
            {contractId}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {showDeployForm ? (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
            {deployState === 'ERROR' && errorMessage && (
              <div style={{
                marginBottom: '10px', padding: '10px 12px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '10px', display: 'flex', gap: '8px',
                color: '#fca5a5', fontSize: '12px',
              }}>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                {errorMessage}
              </div>
            )}
            <button
              onClick={handleDeploy}
              disabled={deployState === 'DEPLOYING'}
              style={{
                width: '100%', background: '#f97316', border: 'none',
                color: '#0f172a', fontWeight: 800, fontSize: '13px',
                padding: '11px', borderRadius: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginBottom: '8px', opacity: deployState === 'DEPLOYING' ? 0.6 : 1,
              }}
            >
              {deployState === 'DEPLOYING'
                ? <><Cpu size={15} style={{ animation: 'spin 1s linear infinite' }} /> Deploying...</>
                : 'Confirm Redeploy'}
            </button>
            <button onClick={() => setShowDeployForm(false)} style={{
              background: 'none', border: 'none', color: '#64748b',
              fontSize: '12px', cursor: 'pointer', width: '100%', textAlign: 'center',
            }}>
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a
              href={`https://explorer.1am.xyz/contract/${contractId}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: '#e2e8f0', fontSize: '13px', fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.11)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            >
              View on 1AM Explorer <ExternalLink size={13} />
            </a>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: '11px', color: '#475569',
            }}>
              <span>Compact v0.24 • Zero-Knowledge</span>
              <button
                onClick={() => setShowDeployForm(true)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748b', fontSize: '11px',
                  textDecoration: 'underline', textUnderlineOffset: '2px',
                }}
              >
                Redeploy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
