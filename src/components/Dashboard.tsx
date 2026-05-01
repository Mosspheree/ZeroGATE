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
  Clock, 
  Globe, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Session, TelemetryPoint, RiskLevel } from '../types';

interface DashboardProps {
  sessions: Session[];
  telemetry: TelemetryPoint[];
  onRevoke: (id: string) => void;
}

const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
  <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
        <Icon size={20} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-black tracking-wider ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trendValue}
        </div>
      )}
    </div>
    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-1">{title}</p>
    <p className="text-3xl font-light text-white tracking-tight">{value}</p>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ sessions, telemetry, onRevoke }) => {
  const activeSessions = sessions.filter(s => s.status === 'ACTIVE').length;
  const criticalThreats = sessions.filter(s => s.riskLevel === RiskLevel.CRITICAL).length;
  const avgTrust = Math.round(sessions.reduce((acc, s) => acc + s.trustScore, 0) / sessions.length) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Active Sessions" value={activeSessions} icon={Users} trend="up" trendValue="+12%" />
        <StatCard title="Avg Trust Score" value={`${avgTrust}%`} icon={Activity} trend="up" trendValue="+2.1%" />
        <StatCard title="Security Alerts" value={criticalThreats} icon={ShieldAlert} trend={criticalThreats > 0 ? 'down' : 'up'} trendValue={criticalThreats > 0 ? '+2' : 'Stable'} />
        <StatCard title="Global Nodes" value="24" icon={Globe} trend="up" trendValue="Online" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-slate-400">Live Traffic Throughput</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-indigo" />
                <span className="text-[10px] text-slate-500 uppercase font-black">Requests</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#6366f1', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" fillOpacity={1} fill="url(#colorReq)" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8 overflow-hidden">
          <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-slate-400 mb-8">Risk Heatmap</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={sessions.slice(0, 8)}>
                 <XAxis dataKey="user" hide />
                 <YAxis hide />
                 <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                 <Bar dataKey="trustScore" radius={[4, 4, 0, 0]}>
                   {sessions.slice(0, 8).map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.trustScore < 50 ? '#f43f5e' : entry.trustScore < 80 ? '#fb923c' : '#6366f1'} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
               <span>Anomalies Detected</span>
               <span className="text-brand-rose">{sessions.filter(s => s.trustScore < 60).length} Session(s)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center">
           <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-slate-400">Active Identity Sessions</h3>
           <button className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 transition-colors text-[10px] font-black uppercase tracking-widest text-slate-400">
              Download Audit
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800/50 bg-white/[0.02]">
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Subject</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Network Info</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Trust Index</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                <th className="py-5 px-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {sessions.map((session) => (
                <tr key={session.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                        {session.user[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-0.5">{session.user}</p>
                        <p className="text-xs text-slate-500 font-mono">{session.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <p className="text-xs text-slate-300 mb-1">{session.source}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{session.ip}</p>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-3">
                       <div className="flex-1 h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${session.trustScore < 50 ? 'bg-rose-500' : session.trustScore < 80 ? 'bg-orange-500' : 'bg-brand-indigo'}`}
                            style={{ width: `${session.trustScore}%` }}
                          />
                       </div>
                       <span className={`text-xs font-mono font-bold ${session.trustScore < 50 ? 'text-rose-400' : session.trustScore < 80 ? 'text-orange-400' : 'text-brand-indigo'}`}>
                         {session.trustScore}%
                       </span>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest border transition-colors
                      ${session.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 
                        session.status === 'REVOKED' ? 'bg-rose-400/10 text-rose-400 border-rose-400/20' : 
                        'bg-orange-400/10 text-orange-400 border-orange-400/20'}`}>
                      {session.status}
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button 
                      onClick={() => onRevoke(session.id)}
                      disabled={session.status === 'REVOKED'}
                      className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-30"
                    >
                      <ShieldAlert size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
