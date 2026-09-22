"use client";

import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import Link from 'next/link';
import { ArrowLeft, Activity, Heart, Shield } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { WalletState } from '../../types';
import { DeployContractCard } from '../../components/DeployContractCard';

export default function DashboardPage() {
  const { wallet, setIsWalletModalOpen } = useWallet();
    
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-orange-500 selection:text-white">
      <Navbar />
      

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 lg:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 saas-card p-6 border-slate-200 shadow-sm rounded-2xl bg-white/60">
            <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors mb-8 font-medium">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Home
            </Link>

            <nav className="flex flex-col gap-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 text-orange-700 font-semibold transition-all">
                <Activity size={20} /> Overview
              </Link>
              <Link href="/register" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all group">
                <Heart size={20} className="group-hover:text-rose-500 transition-colors" /> New Registration
              </Link>
              <Link href="/records" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all group">
                <Shield size={20} className="group-hover:text-blue-500 transition-colors" /> Public Ledger
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <div className="flex-1 flex flex-col gap-6">
          
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Donor Portal</h1>
              <p className="text-slate-500 mt-2 text-lg">Manage your zero-knowledge registrations securely.</p>
            </div>
          </header>

          {!wallet.connected ? (
             <div className="saas-card flex flex-col items-center justify-center text-center p-12 md:p-20 border-dashed border-2 border-slate-300 bg-white/50 rounded-3xl">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <Shield size={32} className="text-slate-400" />
               </div>
               <h2 className="text-2xl font-bold text-slate-800 mb-3">Authentication Required</h2>
               <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
                 Connect your Lace or 1AM Wallet to securely access your local zero-knowledge proofs and on-chain status.
               </p>
               <button onClick={() => setIsWalletModalOpen(true)} className="btn-saas-primary shadow-orange-500/20 hover:shadow-orange-500/40 text-lg px-8 py-3 rounded-xl transition-all hover:-translate-y-1">
                 Connect Wallet
               </button>
             </div>
          ) : (
            <div className="grid gap-6">
              
              {/* Wallet Connection Status Card */}
              <div className="saas-card relative overflow-hidden p-6 border-orange-200 bg-orange-50/50 rounded-3xl group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative flex items-center gap-5 z-10">
                  <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl shadow-sm">
                    <Shield size={28} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-orange-950 flex items-center gap-2">
                      Secure Connection Active 
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                      </span>
                    </h3>
                    <p className="text-sm text-orange-700 mt-1 flex items-center gap-2">
                      <span className="font-mono bg-white/60 px-2 py-0.5 rounded border border-orange-200 shadow-sm">{wallet.address}</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Balance Card */}
                <div className="saas-card p-6 md:p-8 bg-white rounded-3xl border-slate-200 hover:border-blue-300 transition-colors group">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Network Balance</h4>
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Activity size={18} />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight flex items-baseline gap-2">
                    {wallet.tNightBalance ? (Number(wallet.tNightBalance) / 1e6).toFixed(2) : '0.00'} 
                    <span className="text-lg md:text-xl font-semibold text-slate-400">tNIGHT</span>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                    tDUST: <span className="font-mono text-slate-800">{wallet.dustBalance ? (Number(wallet.dustBalance) / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}</span>
                  </div>
                </div>

                <DeployContractCard />
                
                {/* Actions Card */}
                <div className="saas-card p-6 md:p-8 bg-white rounded-3xl border-slate-200 hover:border-purple-300 transition-colors flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connected Network</h4>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full border border-purple-200">
                      {wallet.network}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-end gap-3 mt-4">
                    <Link href="/register" className="btn-saas-primary w-full shadow-purple-500/20 hover:shadow-purple-500/40 rounded-xl py-3 text-base flex justify-center items-center gap-2 transition-all hover:-translate-y-0.5">
                      <Heart size={18} /> Register New Commitment
                    </Link>
                    <Link href="/records" className="btn-saas-secondary w-full rounded-xl py-3 text-base flex justify-center items-center gap-2 bg-slate-50 hover:bg-slate-100 border-slate-200 transition-colors">
                      View Public Ledger
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
