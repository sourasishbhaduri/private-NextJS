"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, Heart, Shield } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { PublicLedgerState } from '../../components/PublicLedgerState';
import { WalletState } from '../../types';

export default function RecordsPage() {
    
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-500 selection:text-white">
      <Navbar />
      

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 lg:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 saas-card p-6 border-slate-200 shadow-sm rounded-2xl bg-white/60">
            <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-medium">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Home
            </Link>

            <nav className="flex flex-col gap-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all group">
                <Activity size={20} className="group-hover:text-emerald-500 transition-colors" /> Overview
              </Link>
              <Link href="/register" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all group">
                <Heart size={20} className="group-hover:text-rose-500 transition-colors" /> New Registration
              </Link>
              <Link href="/records" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-semibold transition-all">
                <Shield size={20} /> Public Ledger
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Global Registry</h1>
              <p className="text-slate-500 mt-2 text-lg">Query the immutable Midnight ledger for public statistics.</p>
            </div>
          </header>
          
          <PublicLedgerState 
            data={{ totalDonors: 142, bloodGroupCounts: {1: 15, 2: 42, 3: 8, 4: 35, 5: 6, 6: 22, 7: 3, 8: 11}, lastUpdated: new Date() }}
            onRefresh={() => console.log('Refreshing')}
            isLoading={false}
          />
        </div>
      </main>
    </div>
  );
}
