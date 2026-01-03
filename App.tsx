import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, loginUser, signUpUser } from './firebase';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import JobBoard from './components/JobBoard';
import Assistant from './components/Assistant';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import AssessmentCenter from './pages/AssessmentCenter';
import InterviewArena from './pages/InterviewArena';
import SkillRoadmap from './pages/SkillRoadmap';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth Form State
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Listen for real Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await signUpUser(email, password);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white font-black tracking-widest uppercase animate-pulse">
        Initializing Placement OS...
      </div>
    );
  }

  // 2. Auth Guard: If not logged in, show Auth Terminal
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl transition-all">
          <div className="w-12 h-1 w-full bg-blue-600 rounded-full mb-8"></div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">PlacementOS</h1>
          <p className="text-slate-500 font-bold mb-8 italic">{isLogin ? 'Accessing Secure Terminal...' : 'Provisioning New Identity...'}</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <input 
              type="email" 
              placeholder="Agency Email" 
              className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold focus:ring-2 ring-blue-500 outline-none" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Access Key" 
              className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold focus:ring-2 ring-blue-500 outline-none" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">
              {isLogin ? 'Log In' : 'Register Account'}
            </button>
          </form>

          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="w-full mt-6 text-slate-400 font-bold hover:text-slate-800 transition-all text-sm uppercase tracking-wider"
          >
            {isLogin ? "Need credentials? Create Identity" : "Already have access? Authorize"}
          </button>
        </div>
      </div>
    );
  }

  // 3. Logged In State: Render OS Content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'jobs': return <JobBoard />;
      case 'assistant': return <Assistant />;
      case 'resume': return <ResumeAnalyzer />;
      case 'assessments': return <AssessmentCenter />;
      case 'interviews': return <InterviewArena />;
      case 'roadmap': return <SkillRoadmap />;
      case 'learning':
        return (
          <div className="p-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Learning Integration Hub</h2>
            <p className="text-slate-500">Connecting to Coursera, LinkedIn Learning, and Udemy APIs...</p>
          </div>
        );
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-7xl mx-auto pb-12">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;