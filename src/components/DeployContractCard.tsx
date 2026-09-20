"use client";

import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Rocket, Cpu, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const DeployContractCard: React.FC = () => {
  const { wallet } = useWallet();
  const [deployState, setDeployState] = useState<'IDLE' | 'DEPLOYING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [contractId, setContractId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDeploy = async () => {
    setDeployState('DEPLOYING');
    setErrorMessage(null);
    try {
      const { deployOrganDonorRegistry } = await import('../utils/browserDeploy');
      const deployedAddress = await deployOrganDonorRegistry(wallet);
      setContractId(deployedAddress);
      setDeployState('SUCCESS');
      
      // Save it locally so the app remembers
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
    <div className="saas-card p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border-slate-700 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Rocket className="text-emerald-400" size={24} /> Deploy Contract
            </h4>
            <p className="text-slate-400 text-sm mt-1">Initialize your own Private Registry on Preview</p>
          </div>
        </div>

        {deployState === 'SUCCESS' && contractId ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Deployment Successful!</h3>
            <p className="text-slate-300 text-sm mb-4">Your contract is now live on Midnight Preview.</p>
            <div className="bg-black/30 p-3 rounded-lg border border-white/10 w-full mb-4">
              <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Contract ID</span>
              <span className="font-mono text-emerald-300 text-sm break-all">{contractId}</span>
            </div>
            <a 
              href={`https://preview.midnight.network/transaction/${contractId}`} 
              target="_blank" 
              rel="noreferrer"
              className="btn-saas-secondary text-sm px-4 py-2 flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white w-full justify-center rounded-xl"
            >
              View on Explorer <ExternalLink size={14} />
            </a>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-end">
            {deployState === 'ERROR' && errorMessage && (
              <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-3 text-rose-300 text-sm">
                <AlertTriangle size={18} className="flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}
            
            <button
              onClick={handleDeploy}
              disabled={deployState === 'DEPLOYING'}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex justify-center items-center gap-2"
            >
              {deployState === 'DEPLOYING' ? (
                <>
                  <Cpu size={20} className="animate-spin" /> Compiling & Proving...
                </>
              ) : (
                <>
                  Deploy to Preview
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
              Requires 1AM Wallet approval for balancing/DUST fees. Ensure Docker proof-server is running.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
