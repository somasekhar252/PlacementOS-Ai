
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OpportunityHub from './components/JobBoard';
import Assistant from './components/Assistant';
import ResumeStudio from './components/ResumeStudio';
import PlacementEngine from './pages/PlacementEngine';
import InterviewArena from './pages/InterviewArena';
import AssessmentCenter from './pages/AssessmentCenter';
import ProfileView from './components/ProfileView';
import { api } from './services/api';
import { auth, loginUser, signUpUser, onAuthStateChanged } from './firebase.ts';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await signUpUser(email, password);
      }
      // Note: Removed window.location.reload() as state updates automatically via notifyListeners
    } catch (err: any) {
      setError(err.message || 'Authentication terminal error.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3),transparent_70%)]" />
      <div className="max-w-md w-full glass p-10 rounded-[2.5rem] border border-white/10 text-center space-y-6 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-3xl font-black shadow-2xl">P</div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white">PlacementOS AI</h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{isLogin ? 'Welcome Back Agent' : 'Initialize New Account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Terminal</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="user@placement-os.ai"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Secure Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition-all font-medium text-sm"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-rose-500 text-[10px] font-bold text-center bg-rose-500/10 py-2 rounded-lg">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Signup')}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hover:text-white transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // 1. Wait for Auth State Ready
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Profile only after Auth and enforce Profile Onboarding if missing
  useEffect(() => {
    const checkState = async () => {
      if (user) {
        setProfileLoading(true);
        try {
          const data = await api.get('/profile');
          setProfileData(data);
          
          // Force Onboarding if profile is incomplete or non-existent
          if (!data || data.profileCompleted === false) {
            setActiveTab('profile');
          }
        } catch (e) {
          console.error("Critical Profile Fetch Error:", e);
          setActiveTab('profile');
        } finally {
          setProfileLoading(false);
        }
      } else {
        // Reset state on logout
        setProfileData(null);
      }
    };
    checkState();
  }, [user]);

  if (authLoading || (user && profileLoading)) return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing OS Identity...</p>
    </div>
  );

  if (!user) return <AuthView />;

  const isProfileIncomplete = !profileData || profileData.profileCompleted === false;
  const currentTab = isProfileIncomplete ? 'profile' : activeTab;

  const renderContent = () => {
    try {
      switch (currentTab) {
        case 'dashboard': return <Dashboard />;
        case 'jobs': return <OpportunityHub />;
        case 'assistant': return <Assistant />;
        case 'resume': return <ResumeStudio />;
        case 'placement': return <PlacementEngine />;
        case 'interviews': return <InterviewArena />;
        case 'assessments': return <AssessmentCenter />;
        case 'profile': return <ProfileView onComplete={(data) => {
          setProfileData(data);
          // Small timeout to allow the profile synthesis success state to be visible
          setTimeout(() => setActiveTab('dashboard'), 1500);
        }} />;
        default: return <Dashboard />;
      }
    } catch (err) {
      console.error("Runtime component crash caught:", err);
      return <div className="p-20 text-center bg-white rounded-3xl font-bold text-slate-800">A runtime error occurred. Please refresh the Career OS.</div>;
    }
  };

  return (
    <Layout 
      activeTab={currentTab} 
      setActiveTab={setActiveTab} 
      isLocked={isProfileIncomplete}
    >
      <div className="max-w-[1600px] mx-auto pb-20">{renderContent()}</div>
    </Layout>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
