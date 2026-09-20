"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { WalletState } from '../../types';

export default function PrivacyPage() {
    
  return (
    <div className="app-container">
      <Navbar />
      

      <main className="main-content" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}>
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <div className="saas-card" style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Shield size={32} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '12px' }}>Privacy Model</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Learn exactly what information is public on the blockchain and what stays private on your local device.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            
            {/* Private Data */}
            <div style={{ padding: '30px', background: 'rgba(244,63,94,0.05)', borderRadius: '16px', border: '1px solid rgba(244,63,94,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#f43f5e', color: 'white', padding: '8px', borderRadius: '10px' }}>
                  <EyeOff size={24} />
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e11d48' }}>Private Witness</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                The following information is <strong>never</strong> published to the blockchain. It is only used locally by the Midnight wallet to generate a zero-knowledge proof.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#e11d48' }}>✗</span> Donor Identity & Name</li>
                <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#e11d48' }}>✗</span> Exact Age / Date of Birth</li>
                <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#e11d48' }}>✗</span> Exact Blood Type (Unless explicitly disclosed for supply stats)</li>
                <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#e11d48' }}>✗</span> Medical Clearance Document Hash</li>
              </ul>
            </div>

            {/* Public Data */}
            <div style={{ padding: '30px', background: 'rgba(249, 115, 22,0.05)', borderRadius: '16px', border: '1px solid rgba(249, 115, 22,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#f97316', color: 'white', padding: '8px', borderRadius: '10px' }}>
                  <Eye size={24} />
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ea580c' }}>Public Ledger</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                The following information is recorded on the public Midnight blockchain using the <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px' }}>disclose()</code> function for transparency.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#ea580c' }}>✓</span> Anonymous Cryptographic Commitment</li>
                <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#ea580c' }}>✓</span> Total Number of Registered Donors</li>
                <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#ea580c' }}>✓</span> Aggregated Blood Supply Counts (Anonymized)</li>
                <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#ea580c' }}>✓</span> Binary Consent Status Result (during verification)</li>
              </ul>
            </div>

          </div>

          <div style={{ background: 'var(--bg-app)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>How does verification work?</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              When a hospital needs to verify a donor's eligibility, they do not need access to the central database. Instead, the donor (or their authorized representative) provides the private witness to the local Midnight app.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The Midnight network evaluates the smart contract (Compact circuit) locally, ensuring the donor is over 18, has medical clearance, and matches the previously published commitment hash. The network then verifies the resulting zero-knowledge proof, confirming eligibility without ever seeing the underlying private data.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
