"use client";

import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Activity, Heart, Shield } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { PrivateVerificationModal } from '../../components/PrivateVerificationModal';
import { WalletState } from '../../types';

export default function VerifyPage() {
  const { wallet, setIsWalletModalOpen } = useWallet();
    
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-purple-500 selection:text-white">
      <Navbar />
      

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 lg:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 saas-card p-6 border-slate-200 shadow-sm rounded-2xl bg-white/60">
            <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors mb-8 font-medium">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Home
            </Link>

            <nav className="flex flex-col gap-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all group">
                <Activity size={20} className="group-hover:text-emerald-500 transition-colors" /> Overview
              </Link>
              <Link href="/verify" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 text-purple-700 font-semibold transition-all">
                <ShieldCheck size={20} /> Verify Donor
              </Link>
              <Link href="/records" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all group">
                <Shield size={20} className="group-hover:text-blue-500 transition-colors" /> Public Ledger
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Eligibility Verification</h1>
              <p className="text-slate-500 mt-2 text-lg">Hospitals can verify ZK proofs without accessing private medical records.</p>
            </div>
          </header>
          
          <div className="saas-card bg-white p-6 md:p-10 border-slate-200 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-50 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
            
            <div className="relative z-10 text-center mb-10 max-w-lg mx-auto">
              <div className="bg-purple-100/50 text-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ShieldCheck size={32} />
              </div>
              <p className="text-slate-500 text-lg">
                Enter a donor's public commitment or passphrase to compute the zero-knowledge verification proof against the active Midnight ledger.
              </p>
            </div>

            <div className="relative z-10">
              {wallet.connected ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
                  <PrivateVerificationModal
                    isVerifying={false}
                    onVerify={async (secretId, age, bloodType, clearanceSeed) => {
                      console.log('Verifying', secretId);
                      return { commitment: 'mock', eligible: true, timestamp: new Date() };
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-slate-300 bg-white/50 rounded-2xl">
                  <h2 className="text-xl font-bold text-slate-800 mb-3">Connect Verifier Wallet</h2>
                  <p className="text-slate-500 max-w-md mx-auto mb-8">
                    You must connect an authorized hospital or verifier wallet to submit the read-only ZK proof verification to the network.
                  </p>
                  <button onClick={() => setIsWalletModalOpen(true)} className="btn-saas-primary bg-gradient-to-r from-purple-500 to-indigo-500 shadow-purple-500/20 hover:shadow-purple-500/40 text-base px-8 py-3 rounded-xl transition-all hover:-translate-y-1">
                    Connect Verifier Wallet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
