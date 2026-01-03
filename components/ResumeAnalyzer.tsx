
import React, { useState } from 'react';
import { matchResumeToJob } from '../services/geminiService';

const ResumeAnalyzer: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDiagnostic = async () => {
    if (!resumeText.trim() || !jobText.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await matchResumeToJob(resumeText, jobText);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      alert('Analysis failed. This is a prototype diagnostic tool.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Resume Diagnostic</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Analyze your resume against student roles using structured, judge-friendly diagnostics from Gemini Flash.</p>
        <div className="bg-blue-50 border border-blue-100 py-1 px-4 rounded-full inline-block">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Prototype Feature</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="font-bold text-slate-800">📄 Your Resume Text</h3>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input</span>
          </div>
          <textarea
            className="w-full h-72 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none font-medium text-slate-600"
            placeholder="Paste resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="font-bold text-slate-800">🎯 Job Description</h3>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</span>
          </div>
          <textarea
            className="w-full h-72 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none font-medium text-slate-600"
            placeholder="Paste job description here..."
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleDiagnostic}
          disabled={isLoading || !resumeText || !jobText}
          className="group bg-slate-900 text-white px-12 py-6 rounded-full font-black text-lg hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center gap-4 shadow-2xl active:scale-95"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : 'Audit Readiness'}
          <span>🚀</span>
        </button>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-lg text-center">
              <div className="text-5xl font-black text-blue-600 mb-2">{analysis.matchScore}%</div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Match Score</p>
            </div>

            <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
               <h4 className="font-black text-emerald-900 mb-4 text-xs uppercase tracking-widest">Strengths</h4>
               <ul className="space-y-3">
                 {analysis.strengths.map((s: string, i: number) => (
                   <li key={i} className="flex gap-3 text-xs text-emerald-800 font-bold leading-relaxed">
                     <span className="shrink-0">✔</span> {s}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100">
               <h4 className="font-black text-rose-900 mb-4 text-xs uppercase tracking-widest">Rejection Risks</h4>
               <ul className="space-y-3">
                 {analysis.risks.map((risk: string, i: number) => (
                   <li key={i} className="flex gap-3 text-xs text-rose-800 font-bold leading-relaxed">
                     <span className="shrink-0">⚠</span> {risk}
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
               <h3 className="text-xl font-black mb-8 flex items-center gap-4">
                 <span className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-lg">✨</span>
                 Skills Analysis
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                 <div className="space-y-4">
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Matched Skills</p>
                   <div className="flex flex-wrap gap-2">
                     {analysis.matchedSkills.map((skill: string) => (
                       <span key={skill} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-lg border border-emerald-500/20">{skill}</span>
                     ))}
                   </div>
                 </div>
                 <div className="space-y-4">
                   <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Missing Skills</p>
                   <div className="flex flex-wrap gap-2">
                     {analysis.missingSkills.map((skill: string) => (
                       <span key={skill} className="px-3 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-black rounded-lg border border-rose-500/20">{skill}</span>
                     ))}
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Improvement Suggestions</p>
                 <div className="space-y-3">
                   {analysis.improvementSuggestions.map((step: string, i: number) => (
                     <div key={i} className="flex items-start gap-6 p-6 rounded-3xl bg-slate-800/30 border border-slate-800 hover:bg-slate-800/60 transition-colors group">
                       <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-black text-slate-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors text-xs">{i+1}</div>
                       <p className="text-sm text-slate-200 font-medium leading-relaxed">{step}</p>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
