"use client";

import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Copy, Check, ExternalLink, ShieldCheck, AlertTriangle, Cpu } from 'lucide-react';

const DEFAULT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '8d65e9ea8a166da7ed15128e0bd60dfa4f8d81bac644f1a16f03cf4253cb9a51';

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
    <div className="saas-card p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border-slate-700 relative overflow-hidden shadow-2xl flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Live Contract Active
                </h4>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="text-orange-400" size={22} /> Organ Donor Registry
              </h3>
            </div>
            <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full uppercase">
              Preview
            </span>
          </div>

          <p className="text-slate-400 text-xs mb-4">
            Zero-Knowledge Compact circuit deployed and verified on Midnight Preview network.
          </p>

          <div className="bg-black/40 p-3 rounded-xl border border-white/10 mb-4 group transition-colors hover:border-orange-500/30">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Contract Address</span>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] font-medium transition-colors"
                title="Copy Contract Address"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="font-mono text-orange-300 text-xs break-all select-all">
              {contractId}
            </div>
          </div>
        </div>

        {showDeployForm ? (
          <div className="mt-2 pt-3 border-t border-white/10">
            {deployState === 'ERROR' && errorMessage && (
              <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-2 text-rose-300 text-xs">
                <AlertTriangle size={16} className="flex-shrink-0" />
                <p className="break-words">{errorMessage}</p>
              </div>
            )}
            <button
              onClick={handleDeploy}
              disabled={deployState === 'DEPLOYING'}
              className="w-full bg-orange-500 hover:bg-orange-400 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all text-sm flex justify-center items-center gap-2 mb-2"
            >
              {deployState === 'DEPLOYING' ? (
                <>
                  <Cpu size={16} className="animate-spin" /> Deploying to Preview...
                </>
              ) : (
                'Confirm Redeploy'
              )}
            </button>
            <button
              onClick={() => setShowDeployForm(false)}
              className="text-xs text-slate-400 hover:text-white block w-full text-center py-1"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-2">
            <a
              href={`https://explorer.preview.midnight.network/?search=${contractId}`}
              target="_blank"
              rel="noreferrer"
              className="w-full btn-saas-secondary text-xs py-2.5 px-4 flex items-center justify-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl font-medium transition-all"
            >
              View on Midnight Explorer <ExternalLink size={13} />
            </a>
            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              <span>Compact v0.24 • Zero-Knowledge</span>
              <button
                onClick={() => setShowDeployForm(true)}
                className="text-slate-400 hover:text-orange-400 underline underline-offset-2 transition-colors"
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
