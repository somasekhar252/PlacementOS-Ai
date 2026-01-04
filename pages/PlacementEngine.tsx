
import React, { useState, useEffect } from 'react';

const PlacementEngine: React.FC = () => {
  const [activeSection, setActiveSection] = useState('paths');
  const [isSectionLoading, setIsSectionLoading] = useState(false);

  // Trigger loading state whenever the section changes
  useEffect(() => {
    setIsSectionLoading(true);
    const timer = setTimeout(() => {
      setIsSectionLoading(false);
    }, 800); // Simulate network latency
    return () => clearTimeout(timer);
  }, [activeSection]);

  const engineModules = [
    { id: 'paths', label: 'Learning Paths', icon: '🛣️' },
    { id: 'company', label: 'Company Roadmaps', icon: '🏢' },
    { id: 'assess', label: 'Assessment Arena', icon: '📝' },
    { id: 'tree', label: 'Skill Tree', icon: '🌳' },
    { id: 'peers', label: 'Peer Groups', icon: '👥' }
  ];

  const handleAchievementRedirect = (url: string) => {
    window.open(url, '_blank');
  };

  const ModuleLoader = () => (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-white/50 rounded-[3rem] border border-slate-100 animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-600/10 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
        Initializing Neural Link...
      </p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Premium</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Industry Validated</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Placement Engine <span className="text-blue-600">OS</span></h2>
          <p className="text-slate-500 text-lg font-medium">Your Complete Skill → Company → Placement System</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
           {engineModules.map(mod => (
             <button
               key={mod.id}
               onClick={() => setActiveSection(mod.id)}
               className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                 activeSection === mod.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               <span>{mod.icon}</span>
               {mod.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 min-h-[700px] relative">
          {isSectionLoading ? (
            <ModuleLoader />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeSection === 'paths' && <LearningPathGrid />}
              {activeSection === 'company' && <CompanyRoadmapGrid />}
              {activeSection === 'assess' && <AssessmentArena />}
              {activeSection === 'tree' && <SkillTreeDetails />}
              {activeSection === 'peers' && <PeerLearningGrid />}
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="bg-[#020617] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-20 -mr-24 -mt-24"></div>
             <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center justify-between">
               Achievements
               <span className="text-[10px] text-blue-400">4 / 6</span>
             </h3>
             <div className="space-y-4">
               {[
                 { title: 'First Steps', rarity: 'Common', status: '✅ Unlocked', link: 'https://www.linkedin.com/learning/' },
                 { title: 'Code Warrior', rarity: 'Rare', status: '✅ Unlocked', link: 'https://www.credly.com/' },
                 { title: 'Speed Demon', rarity: 'Epic', status: '✅ Unlocked', link: 'https://www.credly.com/' },
                 { title: 'Master Mind', rarity: 'Legendary', status: '⏳ 75%', link: 'https://www.linkedin.com/' },
                 { title: 'Team Player', rarity: 'Rare', status: '✅ Unlocked', link: 'https://discord.com/' },
                 { title: 'Consistency King', rarity: 'Epic', status: '⏳ 60%', link: 'https://github.com/' },
               ].map((ach, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 cursor-pointer transition-colors" onClick={() => handleAchievementRedirect(ach.link)}>
                   <div>
                     <p className="font-bold text-xs">{ach.title}</p>
                     <p className="text-[8px] text-slate-500 font-black uppercase">{ach.rarity}</p>
                   </div>
                   <span className="text-[9px] font-black uppercase text-blue-400">{ach.status}</span>
                 </div>
               ))}
               <button onClick={() => window.open('https://www.credly.com/', '_blank')} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Claim Credentials</button>
             </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">🏆</div>
                <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase">Readiness Score</h3>
              </div>
              <div className="text-5xl font-black text-emerald-600">94%</div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">You are in the top 5% of candidates for roles at partner companies like Microsoft & Google.</p>
              <button onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/', '_blank')} className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">Share Verified Report</button>
           </div>
        </div>
      </div>

      <footer className="pt-12 border-t border-slate-200">
        <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-[0.2em]">
          Learning resources and assessments are powered by or redirected to industry-leading platforms. All trademarks belong to their respective owners.
        </p>
      </footer>
    </div>
  );
};

const LearningPathGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { title: 'Full Stack Web Development', icon: '💻', desc: 'Frontend, backend, databases, deployment.', tags: ['Career-Ready'], link: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' },
      { title: 'Data Science & ML', icon: '📊', desc: 'Python, ML algorithms, data visualization.', tags: ['Kaggle', 'Future-Proof'], link: 'https://www.kaggle.com/learn' },
      { title: 'Mobile App Development', icon: '📱', desc: 'Android, iOS, cross-platform frameworks.', tags: ['Expo', 'Flutter'], link: 'https://docs.expo.dev/learn/introduction/' },
      { title: 'Cloud & DevOps', icon: '☁️', desc: 'AWS, Docker, CI/CD, Kubernetes.', tags: ['AWS Skill Builder'], link: 'https://explore.skillbuilder.aws/' },
      { title: 'UI/UX Design Fundamentals', icon: '🎨', desc: 'User research, wireframing, design systems.', tags: ['Figma Learn'], link: 'https://help.figma.com/hc/en-us/categories/360002042433-Learn-Figma' },
      { title: 'Cybersecurity Essentials', icon: '🛡️', desc: 'Network security, ethical hacking, compliance.', tags: ['TryHackMe'], link: 'https://tryhackme.com/' },
    ].map((path, i) => (
      <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-500 transition-all group flex flex-col justify-between">
         <div>
           <div className="text-4xl mb-6 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">{path.icon}</div>
           <h4 className="text-xl font-black text-slate-900 mb-2 leading-tight">{path.title}</h4>
           <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">{path.desc}</p>
         </div>
         <div className="space-y-6">
           <div className="flex flex-wrap gap-2">
             {path.tags.map(tag => <span key={tag} className="text-[9px] font-black text-slate-400 border border-slate-100 px-2 py-1 rounded uppercase">{tag}</span>)}
           </div>
           <button 
             onClick={() => window.open(path.link, '_blank')}
             className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 transition-colors"
           >
             Continue Learning →
           </button>
         </div>
      </div>
    ))}
  </div>
);

const CompanyRoadmapGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { 
        name: 'Google', 
        logo: '🔵', 
        roles: 8, 
        diff: 'Advanced', 
        time: '6-8 months', 
        skills: ['DS', 'Algorithms', 'Sys Design'],
        learners: '2.4k',
        link: 'https://leetcode.com/company/google/'
      },
      { 
        name: 'Amazon', 
        logo: '🟠', 
        roles: 12, 
        diff: 'Advanced', 
        time: '5-7 months', 
        skills: ['Leadership Principles', 'AWS'],
        learners: '3.1k',
        link: 'https://leetcode.com/company/amazon/'
      },
      { 
        name: 'Microsoft', 
        logo: '🟢', 
        roles: 10, 
        diff: 'Intermediate', 
        time: '4-6 months', 
        skills: ['C#', 'Azure', 'Algorithms'],
        learners: '1.8k',
        link: 'https://learn.microsoft.com/en-us/training/'
      },
      { 
        name: 'Infosys', 
        logo: '🔷', 
        roles: 6, 
        diff: 'Beginner', 
        time: '2-3 months', 
        skills: ['Java', 'SQL', 'Aptitude'],
        learners: '5.2k',
        link: 'https://infyspringboard.onwingspan.com/'
      },
      { 
        name: 'TCS', 
        logo: '🔵', 
        roles: 8, 
        diff: 'Beginner', 
        time: '2-4 months', 
        skills: ['C', 'Java', 'Verbal Ability'],
        learners: '6.8k',
        link: 'https://learning.tcsionhub.in/'
      },
      { 
        name: 'Wipro', 
        logo: '🟣', 
        roles: 7, 
        diff: 'Intermediate', 
        time: '3-5 months', 
        skills: ['Python', 'SQL', 'Web Dev'],
        learners: '4.3k',
        link: 'https://www.hackerrank.com/wipro'
      },
    ].map((co, i) => (
      <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-500 transition-all group">
         <div className="flex justify-between items-start mb-6">
           <div className="flex items-center gap-4">
             <div className="text-3xl bg-slate-50 w-14 h-14 rounded-xl flex items-center justify-center">{co.logo}</div>
             <div>
               <h4 className="text-xl font-black text-slate-900 leading-tight">{co.name}</h4>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{co.learners} learners</p>
             </div>
           </div>
           <button 
             onClick={() => window.open(co.link, '_blank')}
             className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
           >
             View Roadmap →
           </button>
         </div>
         
         <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-slate-50 p-3 rounded-2xl text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Roles</p>
              <p className="text-xs font-black text-slate-900">{co.roles}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Difficulty</p>
              <p className="text-[9px] font-black text-blue-600">{co.diff}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Time</p>
              <p className="text-[8px] font-black text-slate-900 whitespace-nowrap">{co.time}</p>
            </div>
         </div>

         <div className="space-y-3">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Industry Prep Focus</p>
           <div className="flex flex-wrap gap-1.5">
             {co.skills.map(s => <span key={s} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold border border-blue-100">{s}</span>)}
           </div>
         </div>
      </div>
    ))}
  </div>
);

const AssessmentArena = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[
      { title: 'Quantitative Aptitude Test', qs: 50, time: '60m', diff: 'Medium', attempts: '1.2k', score: '78%', type: 'Aptitude', link: 'https://www.indiabix.com/' },
      { title: 'Data Structures & Algorithms', qs: 40, time: '90m', diff: 'Hard', attempts: '890', score: '65%', type: 'Technical', link: 'https://leetcode.com/problemset/all/' },
      { title: 'English Proficiency Test', qs: 60, time: '45m', diff: 'Easy', attempts: '2.1k', score: '85%', type: 'Communication', link: 'https://www.britishcouncil.org/english/skills' },
      { title: 'JavaScript Coding Challenge', qs: 25, time: '120m', diff: 'Medium', attempts: '756', score: 'Not Attempted', type: 'Coding', link: 'https://codesignal.com/' },
    ].map((a, i) => (
      <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between group">
         <div className="space-y-6">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-widest">{a.type}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.diff}</span>
           </div>
           <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{a.title}</h4>
           <div className="flex items-center gap-6 text-[11px] text-slate-500 font-black uppercase tracking-tight">
             <span>📋 {a.qs} Questions</span>
             <span>⏱️ {a.time}</span>
             <span>👥 {a.attempts} attempts</span>
           </div>
           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Status</p>
                <p className={`text-2xl font-black ${a.score === 'Not Attempted' ? 'text-slate-300' : 'text-blue-600'}`}>{a.score}</p>
              </div>
              <button 
                onClick={() => window.open(a.link, '_blank')}
                className="bg-white px-6 py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                {a.score === 'Not Attempted' ? '▶ Start on Industry Platform' : '🔁 Retake Assessment'}
              </button>
           </div>
         </div>
      </div>
    ))}
  </div>
);

const SkillTreeDetails = () => (
  <div className="space-y-8">
    <div className="bg-blue-600 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
      <div className="space-y-2">
        <h3 className="text-2xl font-black">Visual Skill Dependencies</h3>
        <p className="text-blue-100 text-sm font-medium">Map your progress through the industry's most trusted curriculum tree.</p>
      </div>
      <button 
        onClick={() => window.open('https://roadmap.sh', '_blank')}
        className="bg-white text-blue-600 px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95"
      >
        View Interactive Skill Tree →
      </button>
    </div>

    {[
      { 
        level: 1, 
        skills: [
          { name: 'Programming Basics', progress: 100, status: '✅ Completed' },
          { name: 'Data Structures', progress: 100, status: '✅ Completed' },
          { name: 'Algorithms', progress: 65, status: '⏳ In Progress' }
        ],
        theme: 'emerald'
      },
      { 
        level: 2, 
        skills: [
          { name: 'Web Development', progress: 45, status: '⏳ In Progress' },
          { name: 'Database Management', progress: 0, status: '🔓 Available' },
          { name: 'Version Control', progress: 0, status: '🔓 Available' }
        ],
        theme: 'amber'
      },
    ].map((lvl, i) => (
      <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="flex items-center gap-6 mb-10">
            <div className={`w-14 h-14 bg-${lvl.theme}-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl`}>L{lvl.level}</div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Internal Skill Audit (L{lvl.level})</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lvl.skills.map((s, j) => (
              <div key={j} className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-800">{s.name}</span>
                  <span className="text-[10px] font-black text-blue-600">{s.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                   <div className={`h-full bg-${lvl.theme}-600 transition-all duration-1000`} style={{width: `${s.progress}%`}}></div>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>{s.status}</span>
                </div>
              </div>
            ))}
         </div>
      </div>
    ))}
  </div>
);

const PeerLearningGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[
      { title: 'React Developers Circle', members: 156, link: 'https://discord.com', type: 'Web Development' },
      { title: 'Data Science Study Group', members: 203, link: 'https://discord.com', type: 'Data Science' },
      { title: 'Interview Prep Warriors', members: 342, link: 'https://peerlist.io', type: 'Interview Prep' },
      { title: 'Cloud Computing Enthusiasts', members: 128, link: 'https://discord.com', type: 'Cloud & DevOps' },
    ].map((p, i) => (
      <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between group">
         <div>
            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{p.type}</span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Community</span>
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-6">{p.title}</h4>
            <div className="flex items-center gap-3 mb-8">
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(idx => <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 shadow-sm" />)}
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.members} active members</span>
            </div>
         </div>
         <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
            <p className="text-xs font-bold text-slate-600">Verified Partner Community</p>
            <button 
              onClick={() => window.open(p.link, '_blank')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              Join Group →
            </button>
         </div>
      </div>
    ))}
  </div>
);

export default PlacementEngine;
