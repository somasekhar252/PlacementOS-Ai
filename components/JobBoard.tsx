
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const OpportunityHub: React.FC = () => {
  const [activeView, setActiveView] = useState<'jobs' | 'assessments'>('jobs');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.get('/jobs');
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(filter.toLowerCase()) || 
    j.company.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Opportunity Hub</h2>
          <p className="text-slate-500 text-lg font-medium">AI-matched jobs + real assessments + readiness insights</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           <button 
             onClick={() => setActiveView('jobs')}
             className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeView === 'jobs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Hiring Gateway
           </button>
           <button 
             onClick={() => setActiveView('assessments')}
             className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeView === 'assessments' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Assessment Center
           </button>
        </div>
      </div>

      {activeView === 'jobs' ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-slate-100 rounded-2xl">🔍</div>
            <input 
              type="text" 
              placeholder="Filter by role, skills, or company..." 
              className="flex-1 bg-transparent outline-none font-medium text-slate-600"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {loading ? (
             <div className="grid grid-cols-1 gap-6">
               {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[3rem]"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
                  <p className="text-slate-500 font-bold italic">No matching opportunities found. Try adjusting your filter.</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-10 group">
                    <div className="flex gap-8">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">🏢</div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <h4 className="text-2xl font-black text-slate-900 leading-tight">{job.title}</h4>
                          <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                            🧠 {job.matchScore}% Match
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500">
                          <span>{job.company}</span>
                          <span>📍 {job.location}</span>
                          <span className="text-emerald-600 font-black">{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 min-w-[240px]">
                      <button 
                        onClick={() => window.open(job.link, '_blank')}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                      >
                        Apply on {job.source}
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
           <p className="text-slate-500">Assessment Center Loading...</p>
        </div>
      )}
    </div>
  );
};

export default OpportunityHub;
