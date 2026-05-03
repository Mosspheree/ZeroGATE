/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Activity, 
  Users, 
  ShieldAlert, 
  Globe, 
  ChevronRight,
  Zap,
  Terminal,
  Cpu,
  Fingerprint,
  Lock,
  ArrowUpRight,
  Database,
  Map as MapIcon
} from 'lucide-react';
import { Session, TelemetryPoint, RiskLevel } from '../types';

interface DashboardProps {
  sessions: Session[];
  telemetry: TelemetryPoint[];
  onRevoke: (id: string) => void;
}

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "indigo" }: any) => (
  <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl relative group overflow-hidden">
    <div className={`absolute top-0 left-0 w-1 h-full bg-brand-${color} opacity-0 group-hover:opacity-100 transition-opacity`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-xl bg-brand-${color}/10 flex items-center justify-center text-brand-${color}`}>
        <Icon size={20} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-black tracking-wider ${trend === 'up' ? 'text-green-400' : 'text-rose-400'}`}>
          <div className={`w-1 h-1 rounded-full ${trend === 'up' ? 'bg-green-400' : 'bg-rose-400'} animate-pulse`} />
          {trendValue}
        </div>
      )}
    </div>
    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mb-1">{title}</p>
    <p className="text-3xl font-light text-white tracking-tighter">{value}</p>
  </div>
);

const GlobalMap = () => (
  <div className="relative w-full h-[240px] bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden group">
    <div className="absolute inset-0 opacity-20 technical-grid" />
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
      <motion.path 
        d="M200 150 Q 400 50 600 200" 
        stroke="currentColor" 
        className="text-brand-indigo/30" 
        fill="none" 
        strokeWidth="1"
        strokeDasharray="10 5"
        animate={{ strokeDashoffset: -100 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      />
      <motion.path 
        d="M150 250 Q 400 350 650 180" 
        stroke="currentColor" 
        className="text-brand-rose/20" 
        fill="none" 
        strokeWidth="1"
        strokeDasharray="10 5"
        animate={{ strokeDashoffset: 100 }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      />
      {[
        { x: 200, y: 150, label: "SFO-01", color: "text-brand-indigo" },
        { x: 600, y: 200, label: "LHR-04", color: "text-brand-indigo" },
        { x: 150, y: 250, label: "HKG-02", color: "text-brand-indigo" },
        { x: 650, y: 180, label: "SYD-01", color: "text-brand-rose" },
      ].map((node, i) => (
        <g key={i}>
          <circle cx={node.x} cy={node.y} r="3" className={`${node.color} fill-current`} />
          <circle cx={node.x} cy={node.y} r="8" className={`${node.color} fill-none stroke-current opacity-20`}>
             <animate attributeName="r" from="3" to="15" dur="2s" repeatCount="indefinite" />
             <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={node.x + 10} y={node.y + 4} className="fill-slate-500 font-mono text-[8px] uppercase tracking-widest">{node.label}</text>
        </g>
      ))}
    </svg>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ sessions, telemetry, onRevoke }) => {
  const activeSessions = sessions.filter(s => s.status === 'ACTIVE').length;
  const criticalThreats = sessions.filter(s => s.riskLevel === RiskLevel.CRITICAL).length;
  const avgTrust = Math.round(sessions.reduce((acc, s) => acc + s.trustScore, 0) / sessions.length) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Sessions" value={activeSessions} icon={Users} trend="up" trendValue="+12%" color="indigo" />
        <StatCard title="Neural Trust Index" value={`${avgTrust}%`} icon={Activity} trend="up" trendValue="Verified" color="indigo" />
        <StatCard title="Risk Intercepts" value={criticalThreats} icon={ShieldAlert} trend={criticalThreats > 0 ? 'down' : 'up'} trendValue={criticalThreats > 0 ? 'ATTACK' : 'Stable'} color="rose" />
        <StatCard title="Fabric Latency" value="38ms" icon={Zap} trend="up" trendValue="-4ms" color="indigo" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-slate-500 mb-1">System Throughput</h3>
                <p className="text-xl font-light text-white">Identity Verifications / Sec</p>
              </div>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={telemetry}>
                  <defs>
                    <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#6366f1', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Area type="stepAfter" dataKey="requests" stroke="#6366f1" fillOpacity={1} fill="url(#colorReq)" strokeWidth={2} isAnimationActive={false} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden group">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <Terminal size={18} className="text-brand-indigo" />
                  <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-slate-500">Live Identity Stream</h3>
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {sessions.slice(0, 5).map((session) => (
                    <tr key={session.id} className="group/row hover:bg-white/[0.02] transition-colors border-b border-slate-800/30 last:border-0">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl ${session.riskLevel === RiskLevel.LOW ? 'bg-brand-indigo/10 text-brand-indigo' : 'bg-brand-rose/10 text-brand-rose'} flex items-center justify-center font-black`}>
                            {session.user[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5 tracking-tight">{session.user}</p>
                            <p className="text-[10px] text-slate-500 font-mono italic">{session.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex flex-col gap-2">
                           <div className="flex justify-between items-center text-[9px] font-black tracking-widest text-slate-500 uppercase">
                              <span>Trust Index</span>
                              <span className={session.trustScore < 60 ? 'text-brand-rose' : 'text-brand-indigo'}>{session.trustScore}%</span>
                           </div>
                           <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full ${session.trustScore < 60 ? 'bg-brand-rose' : 'bg-brand-indigo'}`} style={{ width: `${session.trustScore}%` }} />
                           </div>
                        </div>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button 
                          onClick={() => onRevoke(session.id)}
                          className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-brand-rose transition-all"
                          disabled={session.status === 'REVOKED'}
                        >
                          <Lock size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8 group">
             <div className="flex items-center gap-3 mb-8">
                <MapIcon size={18} className="text-brand-indigo" />
                <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-slate-500">Global Topology</h3>
             </div>
             <GlobalMap />
          </div>

          <div className="bg-brand-indigo/10 border border-brand-indigo/20 rounded-3xl p-8 relative overflow-hidden group">
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-indigo mb-6 flex items-center gap-2">
               <Fingerprint size={12} /> Neural Enforcement
            </h3>
            <p className="text-xl font-light text-white mb-6 tracking-tight">CAEP Real-Time Revocation Protocol Active</p>
            <button className="w-full mt-6 py-4 bg-brand-indigo text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-indigo/80 transition-colors">
               Deploy New Policy
            </button>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-slate-500 mb-6">Incident Log</h3>
            <div className="space-y-4 font-mono text-[10px]">
               {[
                 { t: "12:44:21", m: "WARN: Impossible travel HKG -> SFO", s: "rose" },
                 { t: "12:42:04", m: "INFO: DPoP proof verified", s: "indigo" },
                 { t: "12:38:12", m: "CRIT: Forced revocation", s: "rose" },
               ].map((log, i) => (
                 <div key={i} className="flex gap-4">
                    <span className="text-slate-600">{log.t}</span>
                    <span className={`text-brand-${log.s} opacity-80 uppercase`}>{log.m}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
