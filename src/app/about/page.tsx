"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, Server, ShieldCheck, Database } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { WalletState } from '../../types';

export default function AboutPage() {
    
  return (
    <div className="app-container">
      <Navbar />
      

      <main className="main-content" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}>
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <div className="saas-card" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Info size={30} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>About & Architecture</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Midnight Full-Stack DApp for the Rise In Level 3 Challenge</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '24px' }}>
            <section>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#0ea5e9" /> Problem & Solution
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                Traditional organ donor registries require individuals to share highly sensitive medical and identifying information with a centralized database. This creates privacy risks, data silos, and potential unauthorized access.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Using the <strong>Midnight Network</strong>, this application allows individuals to cryptographically register their consent and prove their eligibility (e.g. age, medical clearance) using zero-knowledge proofs, without ever exposing their underlying private data.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={20} color="#0ea5e9" /> Technology Stack
              </h2>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '20px' }}>
                <li><strong>Smart Contracts:</strong> Compact (Midnight's ZK language)</li>
                <li style={{ marginTop: '8px' }}><strong>Frontend:</strong> Next.js (App Router), React, Tailwind CSS</li>
                <li style={{ marginTop: '8px' }}><strong>Wallet Integration:</strong> Lace Wallet / Midnight SDK</li>
                <li style={{ marginTop: '8px' }}><strong>Network:</strong> Midnight Preview & Local Devnet</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
