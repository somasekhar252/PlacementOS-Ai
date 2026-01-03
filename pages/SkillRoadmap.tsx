
import React, { useState } from 'react';

const SkillRoadmap: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  const roadmap = [
    { title: 'The Fundamentals', desc: 'Logic building, HTML/CSS, and Javascript basics.', status: 'completed', category: 'Foundation' },
    { title: 'Frontend Mastery', desc: 'React, Hooks, State Management (Redux/Zustand).', status: 'completed', category: 'Frontend' },
    { title: 'Backend Core', desc: 'Node.js, Express, and RESTful API Architecture.', status: 'active', category: 'Backend' },
    { title: 'Scalable Systems', desc: 'PostgreSQL, Redis, and Microservices design.', status: 'pending', category: 'System Design' },
  ];

  const learningLinks = [
    { name: 'Node.js Mastery (YouTube)', platform: 'YouTube', url: 'https://www.youtube.com/results?search_query=node+js+mastery+for+placement' },
    { name: 'Express.js Essentials', platform: 'Coursera', url: 'https://www.coursera.org/search?query=express+js' },
    { name: 'Backend Interview Prep', platform: 'PlacementOS Labs', url: '#' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 py-6">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Career Journey: Senior Software Engineer</h2>
            <p className="text-slate-500 font-medium">Your personalized path from zero to job-ready. Click on active modules to start learning.</p>
          </div>

          <div className="space-y-8 relative before:content-[''] before:absolute before:left-6 before:top-4 before:bottom-4 before:w-1 before:bg-slate-100">
            {roadmap.map((step, i) => (
              <div 
                key={i} 
                className={`pl-16 relative group cursor-pointer transition-all ${step.status === 'pending' ? 'opacity-50 grayscale' : ''}`}
                onClick={() => step.status === 'active' && setSelectedSkill(step)}
              >
                <div className={`absolute left-4 top-1 w-5 h-5 rounded-full border-4 border-white shadow-xl -translate-x-1/2 z-10 transition-all ${
                  step.status === 'completed' ? 'bg-emerald-500' : 
                  step.status === 'active' ? 'bg-blue-600 scale-125 ring-8 ring-blue-50 shadow-blue-600/20' : 'bg-slate-200'
                }`} />
                
                <div className={`p-8 rounded-[2rem] border transition-all ${
                  step.status === 'active' ? 'bg-white border-blue-200 shadow-2xl' : 'bg-slate-50 border-slate-100 hover:border-slate-300'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{step.category}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                      step.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                      step.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-lg">{step.desc}</p>
                  
                  {step.status === 'active' && (
                    <div className="mt-8 flex gap-4">
                      <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all">Start Learning</button>
                      <button className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Curriculum</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-8">
          <div className="bg-[#0F172A] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-16 -mb-16"></div>
             <h3 className="text-xl font-black mb-8">Skill Analysis</h3>
             <div className="space-y-8">
               {[
                 { name: 'Frontend', val: 92, col: 'blue' },
                 { name: 'Backend', val: 45, col: 'emerald' },
                 { name: 'System Design', val: 18, col: 'indigo' },
               ].map((s, i) => (
                 <div key={i} className="space-y-3">
                   <div className="flex justify-between items-end">
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s.name}</span>
                     <span className="text-lg font-black">{s.val}%</span>
                   </div>
                   <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                     <div className={`bg-${s.col}-500 h-full transition-all duration-1000`} style={{width: `${s.val}%`}}></div>
                   </div>
                 </div>
               ))}
             </div>
             <button className="w-full mt-10 bg-slate-800 border border-slate-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-700 transition-colors">Compare with Peer Median</button>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-10 rounded-[3rem] text-white shadow-2xl">
            <h3 className="text-lg font-black uppercase tracking-widest mb-2">Job Readiness Score</h3>
            <div className="text-6xl font-black mb-6">94%</div>
            <p className="text-[11px] text-emerald-100 leading-relaxed font-medium mb-10">You are in the top 5% of candidates for "Backend Engineer" roles in Vizag & Bangalore regions.</p>
            <button className="w-full bg-white text-emerald-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all shadow-xl active:scale-95">View Recommended Jobs</button>
          </div>
        </div>
      </div>

      {selectedSkill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white max-w-2xl w-full p-12 rounded-[3rem] border border-slate-200 shadow-2xl space-y-10 relative">
            <button onClick={() => setSelectedSkill(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors text-2xl">✕</button>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-slate-900">{selectedSkill.title} Resources</h3>
              <p className="text-slate-500 font-medium">Curated by PlacementOS AI to ensure 100% conceptual clarity for placements.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
               {learningLinks.map((link, i) => (
                 <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-blue-50 hover:border-blue-200 transition-all group">
                   <div className="flex items-center gap-4">
                     <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg border border-slate-100 group-hover:border-blue-200">
                        {link.platform === 'YouTube' ? '📺' : '🎓'}
                     </span>
                     <div>
                       <p className="font-bold text-slate-900">{link.name}</p>
                       <p className="text-[10px] font-black uppercase text-slate-400">{link.platform}</p>
                     </div>
                   </div>
                   <span className="text-slate-400 group-hover:text-blue-600 transition-colors">→</span>
                 </a>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillRoadmap;
