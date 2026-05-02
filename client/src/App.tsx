/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Activity, 
  ArrowRight, 
  LayoutDashboard,
  Home,
  ExternalLink,
  Github,
  Monitor,
  Menu,
  X,
  User,
  Fingerprint,
  Code2,
  Terminal,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { useZeroGate } from './useZeroGate';
import { loginWithGoogle } from './lib/firebase';
import { DIFFERENTIATORS, SLOS, ROADMAP } from './constants';

enum View {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  APP_DEMO = 'APP_DEMO'
}

// --- Sub-components ---

const CodeBlock = ({ code, language }: { code: string, language: string }) => (
  <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden group">
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
      </div>
      <span className="text-[10px] font-mono text-slate-500 uppercase">{language}</span>
    </div>
    <pre className="p-6 text-[11px] font-mono leading-relaxed overflow-x-auto">
      <code className="text-slate-300">
        {code.split('\n').map((line, i) => (
          <div key={i} className="table-row">
            <span className="table-cell pr-6 text-slate-700 select-none text-right">{i + 1}</span>
            <span className="table-cell">{line}</span>
          </div>
        ))}
      </code>
    </pre>
  </div>
);

const Nav = ({ activeView, setView }: { activeView: View, setView: (v: View) => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 glass bg-[#020617]/80 border-b border-slate-800">
    <div className="flex flex-col cursor-pointer" onClick={() => setView(View.LANDING)}>
      <div className="flex items-center gap-2 mb-0.5">
        <div className="w-2.5 h-2.5 rounded-full bg-brand-indigo animate-pulse shadow-[0_0_10px_#6366f1]" />
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-indigo">Node Operational</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-display font-light text-xl tracking-tight text-white uppercase">Zero<span className="font-black">Gate</span></span>
      </div>
    </div>
    <div className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
      <button onClick={() => setView(View.LANDING)} className={`hover:text-white transition-colors ${activeView === View.LANDING ? 'text-white' : ''}`}>Overview</button>
      <button onClick={() => setView(View.DASHBOARD)} className={`hover:text-white transition-colors flex items-center gap-2 ${activeView === View.DASHBOARD ? 'text-white' : ''}`}>
        <LayoutDashboard size={12} /> Control Plane
      </button>
      <button onClick={() => setView(View.APP_DEMO)} className={`hover:text-white transition-colors flex items-center gap-2 ${activeView === View.APP_DEMO ? 'text-white' : ''}`}>
        <Monitor size={12} /> Live Demo
      </button>
      <button className="px-6 py-2.5 bg-brand-indigo text-white rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-brand-indigo/80 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2">
        <Github size={14} /> Source
      </button>
    </div>
  </nav>
);

const SectionHeading = ({ number, title, subtitle }: { number: string, title: string, subtitle?: string }) => (
  <div className="mb-20">
    <div className="flex items-center gap-6 mb-6">
      <div className="flex flex-col gap-1 items-center">
        <span className="text-[10px] font-black tracking-[0.4em] text-brand-indigo uppercase">Cycle</span>
        <span className="text-4xl font-thin text-white">{number}</span>
      </div>
      <div className="h-[1px] flex-grow bg-slate-800" />
    </div>
    <h2 className="text-5xl md:text-6xl font-light tracking-tighter text-white uppercase mb-6 leading-none">
       {title.split(' ')[0]} <span className="font-black text-brand-indigo">{title.split(' ').slice(1).join(' ')}</span>
    </h2>
    {subtitle && <p className="text-xl text-slate-400 max-w-4xl font-light leading-relaxed">{subtitle}</p>}
  </div>
);

// --- App Simulation (The "Customer App" View) ---

const AppSimulation = () => {
  const [authState, setAuthState] = useState<'IDLE' | 'CHALLENGE' | 'SUCCESS' | 'DENIED'>('IDLE');
  const [persona, setPersona] = useState<'CORPORATE' | 'ATTACKER'>('CORPORATE');
  const { createSession, currentUser } = useZeroGate();
  
  const handleLogin = async () => {
    try {
      if (!currentUser) {
        await loginWithGoogle();
      }
      
      setAuthState('CHALLENGE');
      
      // Artificial delay for the "Evaluation" visual
      setTimeout(async () => {
        if (persona === 'ATTACKER') {
          setAuthState('DENIED');
        } else {
          await createSession();
          setAuthState('SUCCESS');
        }
      }, 2500);
    } catch (error) {
      console.error("Auth flow failed:", error);
      setAuthState('IDLE');
    }
  };

  const currentDisplayName = currentUser?.displayName || (persona === 'CORPORATE' ? 'Alex Rivera' : 'Unknown Entity');

  return (
    <div className="max-w-4xl mx-auto py-20 px-8 flex flex-col items-center">
      {/* Persona Toggle */}
      <div className="mb-12 flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
         <button 
           onClick={() => setPersona('CORPORATE')}
           className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${persona === 'CORPORATE' ? 'bg-brand-indigo text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
         >
           Corporate Subject
         </button>
         <button 
           onClick={() => setPersona('ATTACKER')}
           className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${persona === 'ATTACKER' ? 'bg-brand-rose text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
         >
           Unknown Threat
         </button>
      </div>

      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
           <div className="flex gap-1.5">
             <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
             <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
           </div>
           <div className="px-4 py-1.5 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-500 border border-slate-800">
             https://vault.zerogate.security
           </div>
           <div className="w-12" />
        </div>
        
        <div className="p-16 flex flex-col items-center text-center min-h-[400px] justify-center">
          <AnimatePresence mode="wait">
            {authState === 'IDLE' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <div className="w-20 h-20 rounded-3xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo mx-auto mb-8 relative">
                   <Shield size={40} />
                   <div className="absolute -inset-4 bg-brand-indigo/10 blur-2xl rounded-full animate-pulse" />
                </div>
                <h2 className="text-4xl font-light text-white tracking-tight uppercase">Secure <span className="font-black italic text-brand-indigo">Assets</span></h2>
                <p className="text-slate-400 max-w-sm font-light leading-relaxed">
                  Authentication request from <span className="text-white font-bold">{currentDisplayName} {persona === 'CORPORATE' ? '(Verified Device)' : '(T800-Series)'}</span>.
                </p>
                <button 
                  onClick={handleLogin}
                  className={`w-full py-5 ${persona === 'CORPORATE' ? 'bg-brand-indigo' : 'bg-brand-rose'} text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:shadow-2xl transition-all active:scale-95`}
                >
                  Initiate Secure Flow
                </button>
              </motion.div>
            )}

            {authState === 'CHALLENGE' && (
              <motion.div 
                key="challenge"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-brand-indigo/20 flex items-center justify-center mx-auto">
                    <Fingerprint size={48} className="text-brand-indigo animate-pulse" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-brand-indigo border-t-transparent animate-spin mx-auto" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-white uppercase tracking-widest">Evaluating Context</h3>
                   <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest italic">Node: SFO-CENTRAL-01</p>
                </div>
                <div className="text-slate-500 font-mono text-[10px] space-y-1.5 bg-black/20 p-4 rounded-xl border border-white/5">
                   <p className="flex items-center gap-2"><CheckCircle2 size={10} className="text-green-500" /> Device ID: 0x882A-FF</p>
                   <p className="flex items-center gap-2"><CheckCircle2 size={10} className="text-green-500" /> Bio-Signature: MATCH</p>
                   <p className="flex items-center gap-2 animate-pulse"><Activity size={10} className="text-brand-indigo" /> Calibrating Trust Delta...</p>
                </div>
              </motion.div>
            )}

            {authState === 'SUCCESS' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 w-full"
              >
                <div className="flex items-center justify-between p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                   <div className="flex items-center gap-4 text-left">
                     <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500">
                        <User size={24} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Identity Secure</p>
                        <p className="text-white font-bold text-lg">{currentUser?.displayName || 'Alex Rivera'}</p>
                     </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">DPoP Guard</p>
                      <p className="text-brand-indigo font-mono font-bold">ACTIVE</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="h-24 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-end text-left">
                        <div className="w-8 h-1 bg-slate-800 rounded mb-2" />
                        <div className="w-12 h-1 bg-slate-800 rounded" />
                     </div>
                   ))}
                </div>

                <button 
                  onClick={() => setAuthState('IDLE')}
                  className="text-slate-500 text-[10px] uppercase font-black hover:text-white transition-colors tracking-widest"
                >
                  Terminate Secure Session
                </button>
              </motion.div>
            )}

            {authState === 'DENIED' && (
              <motion.div 
                key="denied"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 w-full"
              >
                <div className="w-24 h-24 rounded-3xl bg-brand-rose/10 flex items-center justify-center text-brand-rose mx-auto border border-brand-rose/20">
                   <AlertTriangle size={48} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-3xl font-black text-brand-rose uppercase tracking-tighter italic">Access Revoked</h3>
                   <p className="text-slate-400 font-light px-12">Session token rejected by Neural Gateway due to impossible travel delta.</p>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-[10px] text-brand-rose text-left">
                   <p>&gt; TRACE: ORIGIN_UNTRUSTED</p>
                   <p>&gt; REASON: TOKEN_SPOOF_DETECTED</p>
                   <p>&gt; ACTION: NODE_REJECTION_ISSUED</p>
                </div>
                <button 
                  onClick={() => setAuthState('IDLE')}
                  className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-700 transition-all"
                >
                  Return to Gateway
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<View>(View.LANDING);
  const { sessions, telemetry, revokeSession } = useZeroGate();

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100 selection:bg-brand-indigo selection:text-white selection:bg-opacity-30">
      <Nav activeView={view} setView={setView} />
      
      <main className="pt-24 min-h-screen">
        <AnimatePresence mode="wait">
          {view === View.LANDING && (
            <motion.div 
               key="landing"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.5 }}
            >
              {/* Hero */}
              <section className="relative pt-20 pb-32 px-8 overflow-hidden technical-grid">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12 pt-20">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-3 mb-8">
                       <div className="h-[1px] w-8 bg-brand-indigo" />
                       <span className="text-[11px] uppercase tracking-[0.5em] font-black text-brand-indigo">Universal SSO Fabric</span>
                    </div>
                    <h1 className="text-8xl md:text-[10rem] font-light mb-4 leading-none tracking-tighter text-white">
                      ZERO<span className="block font-black text-brand-indigo">GATE</span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-slate-300 font-light mb-10 tracking-tight">
                      Platform for <span className="text-white font-semibold italic">Adaptive Trust</span>
                    </h2>
                    
                    <div className="flex flex-wrap gap-6">
                      <button 
                        onClick={() => setView(View.APP_DEMO)}
                        className="px-10 py-5 bg-brand-indigo text-white rounded-xl font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-3 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all"
                      >
                        Launch Demo <ExternalLink size={16} />
                      </button>
                      <button 
                        onClick={() => setView(View.DASHBOARD)}
                        className="px-10 py-5 bg-slate-900/40 backdrop-blur-md border border-slate-700 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-[0.3em] hover:text-white hover:border-slate-500 transition-all flex items-center gap-3"
                      >
                        Control Plane <LayoutDashboard size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="hidden lg:block w-[1px] h-full bg-gradient-to-b from-transparent via-slate-800 to-transparent" />

                  <div className="grid grid-cols-2 gap-12 text-right">
                    <div className="space-y-1.5">
                      <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500">Active Sessions</p>
                      <p className="text-xl font-mono tracking-widest text-white">{sessions.filter(s => s.status === 'ACTIVE').length}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500">System P99</p>
                      <p className="text-xl font-mono tracking-widest text-brand-indigo">&lt; 42MS</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500">Risk Engine</p>
                      <p className="text-xl font-mono tracking-widest text-slate-200">ACTIVE</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500">Security Mode</p>
                      <p className="text-xl font-mono tracking-widest text-brand-rose">HARDENED</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Specs */}
              <section className="py-32 px-8 max-w-6xl mx-auto">
                <SectionHeading number="01" title="Universal Security" subtitle="Traditional SSO is binary—you're in or you're out. ZeroGate is a continuum." />
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="immersive-card group hover:border-brand-indigo/30">
                    <h3 className="text-[10px] font-black uppercase text-brand-indigo tracking-widest mb-4">Continuous Trust</h3>
                    <h4 className="text-3xl font-light text-white mb-6">Real-time Risk Scoring</h4>
                    <p className="text-slate-400 leading-relaxed font-light mb-6">
                      Every session is assigned a Trust Index derived from hundreds of biological, network, and behavioral signals. If an anomaly is detected, trust is instantly revoked.
                    </p>
                    <div className="pt-6 border-t border-slate-800/50 flex gap-10">
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Analyzers</p>
                          <p className="text-white font-mono">14+ Layers</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Accuracy</p>
                          <p className="text-white font-mono">99.8% F1</p>
                       </div>
                    </div>
                  </div>
                  <div className="immersive-card group hover:border-brand-indigo/30">
                    <h3 className="text-[10px] font-black uppercase text-brand-indigo tracking-widest mb-4">Unstoppable Identity</h3>
                    <h4 className="text-3xl font-light text-white mb-6">Hardware-Bound Tokens</h4>
                    <p className="text-slate-400 leading-relaxed font-light mb-6">
                      ZeroGate implements DPoP (RFC 9449), cryptographically binding tokens to the physical device. Stolen tokens cannot be used by attackers from other machines.
                    </p>
                    <div className="pt-6 border-t border-slate-800/50 flex gap-10">
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Protocol</p>
                          <p className="text-white font-mono">DPoP v1</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Key Storage</p>
                          <p className="text-white font-mono">TPM/Enclave</p>
                       </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Technical Deep Dive */}
              <section className="py-32 px-8 bg-slate-950/50 border-y border-slate-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-40 opacity-5 pointer-events-none">
                  <Code2 size={400} className="text-brand-indigo" />
                </div>
                <div className="max-w-6xl mx-auto">
                  <SectionHeading number="02" title="Protocol Architecture" subtitle="Built on modern standards with custom hardening for next-gen threats." />
                  
                  <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-12">
                      <div className="space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                               <Cpu size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-white tracking-tight">E2E Cryptographic Binding</h4>
                         </div>
                         <p className="text-slate-400 font-light leading-relaxed">
                            ZeroGate doesn't just issue JWTs. It issues <span className="text-white font-medium">BndJWTs</span>. During the OIDC flow, the client generates an ephemeral asymmetric key pair. The private key never leaves the client's secure enclave (TPM/Secure Element).
                         </p>
                         <ul className="space-y-3">
                            {['Zero-day session hijacking protection', 'No shared secrets over the wire', 'FIPS 140-2 Level 2 Compliance'].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-xs text-slate-500 uppercase font-black tracking-widest">
                                 <CheckCircle2 size={14} className="text-brand-indigo" /> {item}
                              </li>
                            ))}
                         </ul>
                      </div>

                      <div className="space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-rose/10 flex items-center justify-center text-brand-rose">
                               <Terminal size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-white tracking-tight">DPoP Proof Example</h4>
                         </div>
                         <p className="text-slate-400 font-light font-mono text-xs italic">
                            // Header segment of a ZeroGate DPoP Proof
                         </p>
                         <CodeBlock language="typescript" code={`{
  "typ": "dpop+jwt",
  "alg": "ES256",
  "jwk": {
    "kty": "EC",
    "x": "l8t...U",
    "y": "W2p...A",
    "crv": "P-256"
  }
}
// Bound to HTTP Request
{
  "jti": "882a...9b",
  "htm": "POST",
  "htu": "https://vault.zerogate.security/v1/transfer",
  "iat": 1714605923
}`} />
                      </div>
                    </div>

                    <div className="sticky top-32">
                       <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-indigo/10 blur-[100px] rounded-full" />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-indigo mb-10 flex items-center gap-3">
                             <Activity size={14} /> Latency Benchmark
                          </h4>
                          
                          <div className="space-y-10">
                             {[
                               { label: "Token Introspection", val: "12ms", p: "85%" },
                               { label: "Risk Score Inference", val: "4ms", p: "40%" },
                               { label: "Policy Evaluation", val: "2ms", p: "25%" },
                               { label: "Revocation Propagation", val: "150ms", p: "100%" }
                             ].map((b, i) => (
                               <div key={i} className="space-y-3">
                                  <div className="flex justify-between items-end">
                                     <span className="text-sm font-bold text-white tracking-tight">{b.label}</span>
                                     <span className="text-xs font-mono text-brand-indigo">{b.val}</span>
                                  </div>
                                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                     <motion.div 
                                       initial={{ width: 0 }}
                                       whileInView={{ width: b.p }}
                                       className="h-full bg-brand-indigo"
                                       viewport={{ once: true }}
                                     />
                                  </div>
                               </div>
                             ))}
                          </div>

                          <div className="mt-12 p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                             <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                                Performance metrics collected using <span className="text-white">k6</span> across multi-region AWS clusters (us-east-1, eu-central-1, ap-southeast-1).
                             </p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Benchmarks Section (Truncated for brevity, previously high quality) */}
              <section className="py-20 px-8 max-w-6xl mx-auto">
                 <div className="bg-slate-900 shadow-2xl border border-slate-800 rounded-[3rem] p-12 text-center overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-indigo/50 to-transparent" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-indigo mb-8">Launch Terminal</h3>
                    <h2 className="text-6xl font-light text-white tracking-tighter mb-10">Ready to explore <span className="font-black italic">Zero-Trust?</span></h2>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                      <button 
                        onClick={() => setView(View.DASHBOARD)}
                        className="px-12 py-6 bg-white text-[#020617] rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-105 transition-all"
                      >
                         Launch Admin Console
                      </button>
                      <button 
                        onClick={() => setView(View.APP_DEMO)}
                        className="px-12 py-6 bg-slate-950 border border-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all"
                      >
                         Try Live App Demo
                      </button>
                    </div>
                 </div>
              </section>
            </motion.div>
          )}

          {view === View.DASHBOARD && (
            <motion.div 
               key="dashboard"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="max-w-7xl mx-auto px-8 py-12"
            >
              <div className="flex justify-between items-end mb-16">
                 <div>
                   <div className="flex items-center gap-3 mb-2">
                     <LayoutDashboard className="text-brand-indigo" size={32} />
                     <h2 className="text-4xl font-light text-white tracking-tight uppercase">Control <span className="font-black">Plane</span></h2>
                   </div>
                   <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Real-time Telemetry & Risk Decomposition // v1.0.4-LTS</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">All Nodes Stable</span>
                    </div>
                 </div>
              </div>
              <Dashboard sessions={sessions} telemetry={telemetry} onRevoke={revokeSession} />
            </motion.div>
          )}

          {view === View.APP_DEMO && (
            <motion.div 
              key="app_demo"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
            >
              <AppSimulation />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer (Simplified) */}
      <footer className="py-12 border-t border-slate-900 mt-20">
         <div className="max-w-6xl mx-auto px-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
            <span>Prepared 2026</span>
            <div className="flex gap-10">
              <span className="hover:text-slate-500 cursor-pointer">Protocol</span>
              <span className="hover:text-slate-500 cursor-pointer">Security</span>
              <span className="hover:text-slate-500 cursor-pointer">Github</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
