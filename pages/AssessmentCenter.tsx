
import React, { useState } from 'react';

const AssessmentCenter: React.FC = () => {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const assessments = [
    { 
      id: 'fs',
      title: 'Full Stack Tech Quiz', 
      questions: [
        { q: "What does SQL stand for?", a: ["Structured Query Language", "Simple Query Language", "Strong Query Links"], correct: 0 },
        { q: "Which hook is used for side effects in React?", a: ["useState", "useEffect", "useContext"], correct: 1 },
        { q: "What is the default port for Node.js?", a: ["3000", "8080", "Any open port"], correct: 2 },
        { q: "CSS Flexbox property to center children along main axis?", a: ["align-items", "justify-content", "display-center"], correct: 1 }
      ],
      time: '10m', type: 'Technical', difficulty: 'Medium' 
    },
    { id: 'lr', title: 'Logical Reasoning', questions: [], time: '30m', type: 'Aptitude', difficulty: 'Hard' },
  ];

  const handleAnswer = (index: number) => {
    if (index === activeQuiz.questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion + 1 < activeQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-3xl font-black text-slate-900">Assessment Complete!</h2>
          <div className="mt-8 mb-12">
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest mb-2">Final Score</p>
            <p className="text-7xl font-black text-blue-600">{Math.round((score / activeQuiz.questions.length) * 100)}%</p>
          </div>
          <p className="text-slate-500 mb-8 px-8">Great job! This score has been added to your Placement Readiness Score. You've improved your technical standing by 4 points.</p>
          <button onClick={() => { setShowResults(false); setActiveQuiz(null); }} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest">Back to Hub</button>
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    const q = activeQuiz.questions[currentQuestion];
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-12">
        <div className="flex justify-between items-center text-slate-400 font-black text-xs uppercase tracking-widest">
          <span>{activeQuiz.title}</span>
          <span>Question {currentQuestion + 1} of {activeQuiz.questions.length}</span>
        </div>
        <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-12">
          <h3 className="text-2xl font-black text-slate-900 leading-tight">{q.q}</h3>
          <div className="grid grid-cols-1 gap-4">
            {q.a.map((option: string, i: number) => (
              <button 
                key={i} 
                onClick={() => handleAnswer(i)}
                className="w-full p-6 text-left bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 hover:border-blue-500 hover:bg-blue-50 transition-all group flex justify-between items-center"
              >
                <span>{option}</span>
                <span className="w-6 h-6 rounded-full border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-500 flex items-center justify-center text-[10px] text-white">→</span>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all duration-500" style={{width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%`}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assessment Testing Center</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Verify your expertise with industry-standard patterns.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="text-center border-r border-slate-100 pr-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank</p>
            <p className="text-lg font-black text-emerald-600">Top 4%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Score</p>
            <p className="text-lg font-black text-blue-600">92%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {assessments.map((test, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-2xl transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                  test.type === 'Technical' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {test.type}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{test.difficulty}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{test.title}</h3>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 mb-8 font-black uppercase tracking-tighter">
                <span>⏱️ {test.time}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span>📄 {test.questions.length > 0 ? test.questions.length : '25'} Qs</span>
              </div>
            </div>
            <button 
              disabled={test.questions.length === 0}
              onClick={() => { setActiveQuiz(test); setCurrentQuestion(0); setScore(0); }}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest group-hover:bg-blue-600 transition-colors disabled:opacity-20"
            >
              {test.questions.length > 0 ? 'Start Assessment' : 'Coming Soon'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-[#020617] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48"></div>
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tight leading-tight">Placement Eligibility Test (PET 2024)</h2>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed font-medium">This comprehensive exam covers Aptitude, Coding, and English. Scoring above 80% unlocks "Verified Elite" badge on your profile, seen by top product recruiters.</p>
          </div>
          <button className="bg-blue-600 px-12 py-5 rounded-full font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 whitespace-nowrap active:scale-95">
            Register for PET
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCenter;
