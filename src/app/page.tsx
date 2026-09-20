"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Activity, Lock, ArrowRight, Server, FileCheck, CheckCircle, Cpu } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { PrivacyModelBanner } from '../components/PrivacyModelBanner';
import { WalletState } from '../types';

export default function LandingPage() {
    
  return (
    <div className="app-container">
      <Navbar />
      

      <main className="main-content" style={{ padding: '0' }}>
        {/* Hero Section */}
        <section style={{ 
          background: 'var(--card-bg)',
          padding: '100px 20px',
          borderBottom: '1px solid var(--border-light)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Decorative elements */}
          <div style={{ position: 'absolute', top: '-150px', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249, 115, 22,0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }} />
          <div style={{ position: 'absolute', bottom: '-150px', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }} />

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249, 115, 22,0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
              <Shield size={14} /> Powered by Midnight Zero-Knowledge Technology
            </div>
            
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px', color: 'var(--text-main)' }}>
              Private Organ Donation.<br/>
              <span style={{ color: 'var(--primary)' }}>Verifiable Consent.</span><br/>
              Protected Identity.
            </h1>
            
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '650px', margin: '0 auto 40px' }}>
              Use Midnight Zero-Knowledge technology to prove donation eligibility and consent without unnecessarily exposing personal or medical information to the public ledger.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn-saas-primary" style={{ padding: '14px 28px', fontSize: '1.05rem', textDecoration: 'none' }}>
                Register as Donor <ArrowRight size={18} />
              </Link>
              <Link href="/verify" className="btn-saas-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem', border: '1px solid var(--border-light)', background: '#ffffff', color: 'var(--text-main)', textDecoration: 'none' }}>
                Verify Eligibility
              </Link>
            </div>
          </div>
        </section>

        {/* Features / Architecture Visual */}
        <section style={{ padding: '80px 20px', background: '#fafafa' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '40px', letterSpacing: '-0.02em' }}>
              How Zero-Knowledge Preserves Privacy
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              
              <div className="saas-card" style={{ padding: '30px 20px' }}>
                <div style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Lock size={24} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px' }}>Private Data</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Identity, medical history, and exact age never leave your local device.</p>
              </div>

              <div style={{ color: 'var(--border-light)' }}>
                <ArrowRight size={32} style={{ margin: '0 auto' }} />
              </div>

              <div className="saas-card" style={{ padding: '30px 20px', borderColor: 'var(--primary)', boxShadow: '0 10px 30px -10px rgba(249, 115, 22,0.15)' }}>
                <div style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#fff', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(249, 115, 22,0.3)' }}>
                  <Cpu size={24} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px' }}>ZK Proof</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Midnight computes a zero-knowledge proof of eligibility and consent.</p>
              </div>

              <div style={{ color: 'var(--border-light)' }}>
                <ArrowRight size={32} style={{ margin: '0 auto' }} />
              </div>

              <div className="saas-card" style={{ padding: '30px 20px' }}>
                <div style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Server size={24} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px' }}>Verified Registry</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Only anonymous commitments and status are recorded on the ledger.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section style={{ padding: '80px 20px', background: '#ffffff' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              
              <Link href="/dashboard" className="saas-card" style={{ padding: '30px', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s', display: 'block' }}>
                <Activity size={32} color="var(--primary)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>Donor Dashboard</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>View your registration status, network configuration, and manage your private witness keys.</p>
              </Link>

              <Link href="/records" className="saas-card" style={{ padding: '30px', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s', display: 'block' }}>
                <FileCheck size={32} color="#0ea5e9" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>Public Registry</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Query the public Midnight ledger for total donor counts and anonymous blood supply metrics.</p>
              </Link>

              <Link href="/privacy" className="saas-card" style={{ padding: '30px', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s', display: 'block' }}>
                <Shield size={32} color="#8b5cf6" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>Privacy Model</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Learn exactly what information is public on the blockchain versus kept private on your device.</p>
              </Link>

            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '40px 20px', borderTop: '1px solid var(--border-light)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
        <p>Built for the Rise In Midnight Builder Challenge - Level 3</p>
      </footer>
    </div>
  );
}
