
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Dashboard: React.FC = () => {
  const [briefing, setBriefing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBriefing = async () => {
      try {
        const profile = await api.get('/profile');
        if (profile && profile.profileCompleted) {
          const data = await api.get('/dashboard-briefing');
          if (data) setBriefing(data);
          else {
            const fresh = await api.post('/generate-briefing', { profile });
            setBriefing(fresh);
          }
        }
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };
    loadBriefing();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Generating AI Briefing...</p>
      </div>
    );
  }

  // Defend against null briefing to prevent crashes
  if (!briefing) {
    return (
      <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
        <div className="text-5xl mb-6">🛰️</div>
        <h3 className="text-xl font-black text-slate-900 mb-2">OS Standby</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium">Please finalize your professional profile to activate the Career Strategy Briefing engine.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Dynamic Welcome */}
      <div className="bg-[#0F172A] p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-20 -mr-48 -mt-48"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Live AI Briefing</span>
          </div>
          <h2 className="text-4xl font-black leading-tight max-w-3xl">{briefing.welcomeMessage || "Welcome to PlacementOS"}</h2>
          <p className="text-slate-400 text-sm font-medium italic opacity-70">"PlacementOS dynamically synthesizes this dashboard based on your current session data."</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Strengths & Focus */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Preparation Context</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-emerald-600 uppercase">Confirmed Strengths</p>
                <div className="space-y-3">
                  {briefing.strengths?.map((s: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm font-bold text-slate-700">
                      <span className="text-emerald-500">✦</span> {s}
                    </div>
                  )) || <p className="text-slate-400 text-xs">Analyzing...</p>}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-rose-500 uppercase">Improvement Areas</p>
                <div className="space-y-3">
                  {briefing.focusAreas?.map((f: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm font-bold text-slate-700">
                      <span className="text-rose-400">○</span> {f}
                    </div>
                  )) || <p className="text-slate-400 text-xs">Analyzing...</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl shadow-blue-600/20">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6">Immediate Next Steps</h3>
            <div className="space-y-4">
              {briefing.nextSteps?.map((step: string, i: number) => (
                <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/10 text-xs font-bold leading-relaxed">
                  {step}
                </div>
              )) || <p className="text-blue-200 text-xs font-bold">Initializing steps...</p>}
            </div>
            <button className="w-full mt-6 bg-white text-blue-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">Execute Roadmap</button>
          </div>

          <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Session Snapshot</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">{briefing.sessionSummary || "Gathering insights..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
