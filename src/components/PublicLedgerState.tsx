"use client";

import React from 'react';
import { Database, RefreshCw, Activity, Heart, Users } from 'lucide-react';
import { PublicLedgerData } from '../types';

interface PublicLedgerStateProps {
  data: PublicLedgerData;
  onRefresh: () => void;
  isLoading: boolean;
}

const BLOOD_LABELS: Record<number, { name: string; tag: string }> = {
  1: { name: 'O-', tag: 'Universal Donor' },
  2: { name: 'O+', tag: 'Common Positive' },
  3: { name: 'A-', tag: 'Rare Negative' },
  4: { name: 'A+', tag: 'Common Positive' },
  5: { name: 'B-', tag: 'Rare Negative' },
  6: { name: 'B+', tag: 'Common Positive' },
  7: { name: 'AB-', tag: 'Extremely Rare' },
  8: { name: 'AB+', tag: 'Universal Recipient' },
};

export const PublicLedgerState: React.FC<PublicLedgerStateProps> = ({ data, onRefresh, isLoading }) => {
  return (
    <div className="saas-card bg-white p-6 md:p-8 rounded-3xl border-slate-200 shadow-sm relative overflow-hidden">
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100/50 p-3 rounded-2xl text-blue-600 shadow-inner">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">Public Anonymous Ledger State</h2>
            <p className="text-sm text-slate-500 mt-1">
              Real-time on-chain tally of registered donors & anonymized blood supply.
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="btn-saas-secondary flex-shrink-0 px-4 py-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm rounded-xl transition-all hover:border-slate-300"
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin text-blue-500' : 'text-slate-400'} />
          {isLoading ? 'Updating...' : 'Sync Data'}
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        
        {/* Total Donors Counter */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Registered Donors</span>
            <div className="p-2 bg-emerald-100/50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <Users size={20} />
            </div>
          </div>
          <div className="text-5xl font-black text-emerald-500 font-mono tracking-tighter mb-2">
            {data.totalDonors.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-500">🔒</span> Identities 100% Zero-Knowledge Protected
          </div>
        </div>

        {/* Ledger Status */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Contract Status</span>
            <div className="p-2 bg-blue-100/50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-500 flex items-center gap-3 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Active & Indexed
          </div>
          {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && (
            <div className="text-xs font-mono text-slate-500 mt-2 truncate bg-white p-2 rounded border border-slate-200" title={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}>
              {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
            </div>
          )}
          <div className="text-sm font-medium text-slate-400 mt-2">
            {data.lastUpdated ? `Last Sync: ${data.lastUpdated.toLocaleTimeString()}` : 'Connected to Midnight'}
          </div>
        </div>

      </div>

      {/* Anonymized Blood Group Supply Distribution */}
      <div className="relative z-10 pt-4 border-t border-slate-100">
        <h3 className="text-base font-bold text-slate-700 mb-6 flex items-center gap-2">
          <Heart size={18} className="text-rose-500" /> Anonymized Blood Availability Tally
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {Object.entries(BLOOD_LABELS).map(([codeStr, meta]) => {
            const code = parseInt(codeStr, 10);
            const count = data.bloodGroupCounts[code] || 0;
            const hasSupply = count > 0;
            
            return (
              <div
                key={code}
                className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
                  hasSupply 
                    ? 'bg-emerald-50/50 border-emerald-200 hover:shadow-md hover:shadow-emerald-500/10 hover:border-emerald-300' 
                    : 'bg-slate-50 border-slate-100 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-lg font-bold ${hasSupply ? 'text-slate-800' : 'text-slate-500'}`}>
                    {meta.name}
                  </span>
                  <span className={`font-mono text-xl font-black ${hasSupply ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {count}
                  </span>
                </div>
                <div className="text-[0.65rem] md:text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {meta.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
