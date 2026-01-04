
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { auth, doc, setDoc } from '../firebase.ts';

interface ProfileViewProps {
  onComplete?: (data: any) => void;
}

const FirebaseSetupGuide = () => (
  <div className="max-w-3xl mx-auto py-12 px-6 animate-in fade-in duration-500">
    <div className="bg-rose-50 border-2 border-rose-200 rounded-[3rem] p-10 space-y-8 shadow-2xl">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">⚠️</div>
        <div>
          <h2 className="text-2xl font-black text-rose-950">Backend Access Locked</h2>
          <p className="text-rose-700 font-medium">Your Firestore Database Security Rules are preventing access.</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-bold text-rose-900 uppercase tracking-widest">Resolution Steps:</p>
        <ol className="space-y-3 text-sm text-rose-800 font-medium list-decimal ml-5">
          <li>Open your <a href="https://console.firebase.google.com/" target="_blank" className="underline font-black">Firebase Console</a>.</li>
          <li>Navigate to <strong>Firestore Database</strong> in the left sidebar.</li>
          <li>Click the <strong>Rules</strong> tab at the top.</li>
          <li>Replace the existing code with the snippet below:</li>
        </ol>
      </div>

      <div className="bg-slate-900 rounded-3xl p-6 relative group">
        <pre className="text-xs text-blue-300 font-mono leading-relaxed overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /briefings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`}
        </pre>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(`rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /users/{userId} {\n      allow read, write: if request.auth != null && request.auth.uid == userId;\n    }\n    match /briefings/{userId} {\n      allow read, write: if request.auth != null && request.auth.uid == userId;\n    }\n  }\n}`);
            alert("Rules copied to clipboard!");
          }}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Copy Rules
        </button>
      </div>

      <p className="text-xs text-rose-600 font-bold text-center italic">
        After clicking "Publish" in the Firebase Console, refresh this page to activate your Career OS.
      </p>
    </div>
  </div>
);

const ProfileView: React.FC<ProfileViewProps> = ({ onComplete }) => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    branch: '',
    college: '',
    graduationYear: '',
    skills: '',
    projects: '',
    careerGoal: '',
    prepLevel: 'beginner'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setPermissionError(false);
        const data = await api.get('/profile');
        if (data && data.profileCompleted) {
          setProfile(data);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } catch (err: any) {
        if (err.message === 'FIREBASE_PERMISSION_DENIED') {
          setPermissionError(true);
        } else {
          console.error("Profile view fetch error", err);
          setIsEditing(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSynthesize = async () => {
    if (!form.name || !form.skills) return;
    setLoading(true);
    setPermissionError(false);
    const user = auth.currentUser;
    if (!user) return;

    try {
      const result = await api.post('/synthesize-profile', { userDetails: form });
      
      const finalizedData = {
        ...result,
        fullName: form.name,
        branch: form.branch,
        college: form.college,
        graduationYear: form.graduationYear,
        profileCompleted: true,
        updatedAt: new Date().toISOString()
      };
      
      setProfile(finalizedData);
      await api.post('/generate-briefing', { profile: finalizedData });
      
      setLoading(false);
      setIsSuccess(true);
      if (onComplete) onComplete(finalizedData);
    } catch (err: any) {
      if (err.message === 'FIREBASE_PERMISSION_DENIED') {
        setPermissionError(true);
      } else {
        console.error("Synthesis error:", err);
        alert("AI Synthesis failed. Please check connectivity.");
      }
      setLoading(false);
    }
  };

  if (permissionError) {
    return <FirebaseSetupGuide />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600/10 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-slate-900 font-black uppercase text-xs tracking-[0.3em]">AI Synthesis Engine Active</p>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Optimizing Professional Identity Matrix...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-8 animate-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl shadow-emerald-500/20 animate-bounce">
          ✅
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Systems Synced</h2>
          <p className="text-slate-500 font-medium text-lg">Your professional OS has been successfully initialized.</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto space-y-10 py-10 animate-in slide-in-from-bottom-6 duration-500">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">Identity Initialization</div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Professional Identity Synthesis</h2>
          <p className="text-slate-500 font-medium">Configure your core career parameters. Our AI transforms raw data into a recruiter-optimized profile.</p>
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all text-slate-900" 
                placeholder="Johnathan Doe" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Branch / Major</label>
              <input 
                value={form.branch} 
                onChange={e => setForm({...form, branch: e.target.value})} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all text-slate-900" 
                placeholder="Computer Science Engineering" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">College / University</label>
              <input 
                value={form.college} 
                onChange={e => setForm({...form, college: e.target.value})} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all text-slate-900" 
                placeholder="IIT Bombay / Stanford" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Graduation Year</label>
              <input 
                value={form.graduationYear} 
                onChange={e => setForm({...form, graduationYear: e.target.value})} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all text-slate-900" 
                placeholder="2025" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Skill Set (Comma Separated)</label>
            <input 
              value={form.skills} 
              onChange={e => setForm({...form, skills: e.target.value})} 
              placeholder="React, Node.js, Python, AWS, Docker..." 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all text-slate-900" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Key Projects & Achievements</label>
            <textarea 
              value={form.projects} 
              onChange={e => setForm({...form, projects: e.target.value})} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold h-32 resize-none transition-all text-slate-900" 
              placeholder="Built a real-time chat application using Socket.io..." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ultimate Career Goal</label>
            <input 
              value={form.careerGoal} 
              onChange={e => setForm({...form, careerGoal: e.target.value})} 
              placeholder="SDE-1 at Google, Product Manager at Microsoft..." 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all text-slate-900" 
            />
          </div>
          
          <button 
            onClick={handleSynthesize} 
            disabled={!form.name || !form.skills}
            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Synthesize Career OS →
          </button>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || profile?.fullName || "OS User";

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
        <div className="w-40 h-40 bg-blue-600 rounded-[3rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl ring-8 ring-blue-50">
          {displayName.substring(0,2).toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{displayName}</h2>
            <p className="text-blue-600 font-black uppercase text-xs tracking-widest">{profile.headline || "Industry Professional"}</p>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">{profile.summary || "Career data synthesized by PlacementOS AI."}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            {profile.keySkills && profile.keySkills.map((s: string) => (
              <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg border border-slate-200 uppercase tracking-widest">{s}</span>
            ))}
          </div>
        </div>
        <button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-[#0F172A] p-10 rounded-[3rem] text-white shadow-2xl flex flex-col justify-between">
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">Persistent Identity</h3>
            <div className="space-y-2">
              <p className="text-5xl font-black">{profile.preparationStage || "Ready"}</p>
              <p className="text-slate-400 text-xs font-bold italic tracking-wide">Status: Verified Candidate</p>
            </div>
            <div className="space-y-4 border-t border-white/10 pt-8">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Branch & College</p>
               <p className="text-sm font-bold text-slate-200">{profile.branch} | {profile.college}</p>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">Synthesized Goal</p>
               <p className="text-lg font-bold text-slate-200">{profile.careerGoal}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">AI Suggested Focus Areas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {profile.suggestedFocusAreas && profile.suggestedFocusAreas.map((area: string, i: number) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg border border-slate-100 font-black text-blue-600">{i+1}</span>
                <p className="text-sm font-bold text-slate-700 leading-relaxed pt-2">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
