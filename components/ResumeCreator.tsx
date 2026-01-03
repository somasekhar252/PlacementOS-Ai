
import React, { useState } from 'react';
import { generateRecruiterResume } from '../services/geminiService';

const ResumeCreator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({ name: '', skills: '', experience: '', education: '', target: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateRecruiterResume(details, 'Modern Tech');
      setResumeData(result);
    } catch (err) {
      alert('Failed to generate resume. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (resumeData) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900">Your AI-Optimized Resume</h3>
          <div className="flex gap-2">
            <button onClick={() => setResumeData(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900">Edit Details</button>
            <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg">Download PDF</button>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl min-h-[1000px] text-slate-800" id="resume-content">
          <div className="border-b-4 border-blue-600 pb-8 mb-8">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{resumeData.header?.name || details.name}</h1>
            <p className="text-blue-600 font-bold mt-2">{resumeData.header?.title || details.target}</p>
            <p className="text-slate-500 text-xs mt-1">{resumeData.header?.contact}</p>
          </div>

          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-1 space-y-8">
              <section>
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Core Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills?.map((s: string) => (
                    <span key={s} className="px-2 py-1 bg-slate-100 text-[10px] font-bold rounded">{s}</span>
                  ))}
                </div>
              </section>
              <section>
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Education</h4>
                {resumeData.education?.map((e: string) => (
                  <p key={e} className="text-xs font-medium text-slate-600 leading-relaxed mb-2">{e}</p>
                ))}
              </section>
            </div>

            <div className="col-span-2 space-y-8">
              <section>
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Professional Profile</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{resumeData.summary}</p>
              </section>
              <section>
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Work & Projects</h4>
                <div className="space-y-6">
                  {resumeData.experience?.map((exp: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <h5 className="font-bold text-slate-900">{exp.role}</h5>
                        <span className="text-[10px] font-bold text-slate-400">{exp.duration}</span>
                      </div>
                      <p className="text-xs font-bold text-blue-500">{exp.company}</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {exp.achievements?.map((a: string, j: number) => (
                          <li key={j} className="text-xs text-slate-600 leading-relaxed">{a}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Resume Architect Wizard</h2>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">What is your Full Name?</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="John Doe"
                value={details.name}
                onChange={e => setDetails({...details, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">Target Job Title</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="Software Engineer"
                value={details.target}
                onChange={e => setDetails({...details, target: e.target.value})}
              />
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Next: Experience</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">Experience / Projects (Raw text)</label>
              <textarea 
                className="w-full h-48 bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="Worked as an intern at TechCo. Built a dashboard using React..."
                value={details.experience}
                onChange={e => setDetails({...details, experience: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold">Next: Skills</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">List Your Skills & Tools</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="React, Node.js, Python, SQL, Figma..."
                value={details.skills}
                onChange={e => setDetails({...details, skills: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase">Education Details</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="B.Tech in CS, XYZ University, 2024"
                value={details.education}
                onChange={e => setDetails({...details, education: e.target.value})}
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-600/20"
            >
              {isGenerating ? 'AI Brain Processing...' : 'Generate Expert Resume'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeCreator;
