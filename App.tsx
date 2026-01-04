
import React, { useState } from 'react';
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'jobs':
        return <JobBoard />;
      case 'assistant':
        return <Assistant />;
      case 'resume':
        return <ResumeAnalyzer />;
      case 'assessments':
        return <AssessmentCenter />;
      case 'interviews':
        return <InterviewArena />;
      case 'roadmap':
        return <SkillRoadmap />;
      case 'learning':
        return (
          <div className="p-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Learning Integration Hub</h2>
            <p className="text-slate-500">Connecting to Coursera, LinkedIn Learning, and Udemy APIs...</p>
          </div>
        );
      default:
        return <Dashboard />;
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
