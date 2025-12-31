
import React, { useState, useEffect } from 'react';
import { Question, QuizHistoryItem } from '../types';
import { generateQuizQuestions } from '../services/geminiService';
import { ITIL_CONCEPTS } from '../constants';

type QuizView = 'menu' | 'loading' | 'playing' | 'finished';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [topic, setTopic] = useState(ITIL_CONCEPTS[0].title);
  
  const [view, setView] = useState<QuizView>('menu');
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('itil_quiz_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse quiz history", error);
      }
    }
  }, []);

  const saveHistory = (finalScore: number) => {
    const newItem: QuizHistoryItem = {
      id: Date.now().toString(),
      topic: topic,
      score: finalScore,
      total: questions.length,
      date: new Date().toISOString()
    };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('itil_quiz_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your quiz history?')) {
      setHistory([]);
      localStorage.removeItem('itil_quiz_history');
    }
  };

  const startQuiz = async () => {
    setView('loading');
    setError(null);
    try {
      const q = await generateQuizQuestions(topic);
      if (!q || q.length === 0) {
        throw new Error("No questions were generated.");
      }
      setQuestions(q);
      setCurrentIdx(0);
      setScore(0);
      setShowExplanation(false);
      setSelectedOption(null);
      setView('playing');
    } catch (err: any) {
      console.error("Failed to fetch questions:", err);
      setView('menu'); 
      
      let errorMessage = "Unable to generate quiz questions at this time. Please try again.";
      
      if (err instanceof SyntaxError) {
        errorMessage = "Received malformed data from the AI service. Please try again.";
      } else if (err.message && (err.message.includes("429") || err.message.includes("quota"))) {
        errorMessage = "Service is busy (Rate Limit Exceeded). Please wait a moment before trying again.";
      } else if (err.message && err.message.includes("SAFETY")) {
        errorMessage = "The content generation was flagged by safety settings. Please try a different topic.";
      }

      setError(errorMessage);
    }
  };

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === questions[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      saveHistory(score);
      setView('finished');
    }
  };

  const getTopicSummary = (topicName: string) => {
    if (topicName === 'General ITIL 4 Foundation') {
      return "Covers all key areas including SVS, SVC, Guiding Principles, and Practices.";
    }
    const concept = ITIL_CONCEPTS.find(c => c.title === topicName);
    return concept ? concept.description : "Practice session on ITIL 4 concepts.";
  };

  const renderHistory = () => (
    <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Past Results
        </h3>
        {history.length > 0 && (
          <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-700 font-medium hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">
            Clear History
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="text-slate-400 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          No quizzes taken yet. Start practicing!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Topic</th>
                <th className="px-6 py-4 font-semibold tracking-wider hidden md:table-cell">Summary</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap text-sm">
                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-slate-800 font-semibold text-sm">
                    {item.topic}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm hidden md:table-cell max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:bg-white group-hover:z-10 group-hover:shadow-lg group-hover:rounded p-2">
                    {getTopicSummary(item.topic)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${item.score >= item.total * 0.7 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {item.score}/{item.total}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  if (view === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-100 border-t-indigo-600"></div>
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-800">Generating Questions...</p>
          <p className="text-slate-500 text-sm mt-1">Focusing on: {topic}</p>
        </div>
      </div>
    );
  }

  if (view === 'menu') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 text-center mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-2xl mb-6 text-5xl shadow-inner">
              🎓
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Practice Quiz</h2>
            <p className="text-slate-600 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
              Select a specific ITIL 4 Foundation topic to test your knowledge and readiness for the exam.
            </p>
            
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 text-red-800 text-sm flex items-center justify-center gap-3 animate-fade-in mx-auto max-w-lg">
                <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="max-w-md mx-auto space-y-6">
              <div className="text-left group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Choose Topic</label>
                <div className="relative">
                  <select 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-4 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 hover:bg-white transition-all appearance-none font-medium text-slate-700 cursor-pointer shadow-sm"
                  >
                    {ITIL_CONCEPTS.map((c, i) => (
                      <option key={i} value={c.title}>{c.title}</option>
                    ))}
                    <option value="General ITIL 4 Foundation">General ITIL 4 Foundation</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={startQuiz}
                className="w-full bg-indigo-600 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-indigo-200 shadow-md"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
        {renderHistory()}
      </div>
    );
  }

  if (view === 'finished') {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl p-10 md:p-12 text-center mb-8 border border-slate-100">
          <div className="text-6xl mb-6 animate-bounce-short">🏆</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Quiz Complete!</h2>
          <p className="text-slate-500 mb-8 text-lg font-medium">{topic}</p>
          
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="text-6xl font-black text-indigo-600 mb-2 tracking-tight">
              {score}
              <span className="text-3xl text-slate-300 font-normal ml-2">/ {questions.length}</span>
            </div>
            
            <div className="w-full max-w-md bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${score === questions.length ? 'bg-green-500' : 'bg-indigo-600'}`} 
                style={{ width: `${(score / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="max-w-lg mx-auto mb-10">
            <div className={`p-6 rounded-2xl ${score >= questions.length * 0.7 ? 'bg-indigo-50 border border-indigo-100' : 'bg-amber-50 border border-amber-100'}`}>
              <p className={`text-lg font-bold ${score >= questions.length * 0.7 ? 'text-indigo-900' : 'text-amber-800'}`}>
                {score === questions.length ? "Perfect score! You're an ITIL Master." : score >= questions.length * 0.7 ? "Great job! You demonstrate solid understanding." : "Keep studying, reviewing the core concepts will help!"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
              onClick={() => setView('menu')}
              className="px-8 py-4 rounded-xl font-bold text-indigo-600 bg-white border-2 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
            >
              Back to Menu
            </button>
            <button 
              onClick={startQuiz}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg transition-all shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
        {renderHistory()}
      </div>
    );
  }

  // View === 'playing'
  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8 px-2">
        <button 
          onClick={() => setView('menu')} 
          className="group flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
           <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center mr-2 transition-colors">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
           </div>
           Exit Quiz
        </button>
        <div className="flex flex-col items-end">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Progress</span>
           <div className="flex items-center gap-2">
             <span className="text-sm font-bold text-slate-900">{currentIdx + 1} <span className="text-slate-400 font-normal">/ {questions.length}</span></span>
             <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
             </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100">
              Question {currentIdx + 1}
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>
          
          <div className="space-y-4 mb-10">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = currentQuestion.correctAnswer === idx;
              
              let btnClass = "w-full text-left p-5 md:p-6 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group relative ";
              
              if (!showExplanation) {
                btnClass += isSelected 
                  ? "border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600 z-10" 
                  : "border-slate-100 bg-white hover:border-indigo-300 hover:bg-slate-50 hover:shadow-sm";
              } else {
                if (isCorrect) btnClass += "border-green-500 bg-green-50 text-green-900 ring-1 ring-green-500 z-10";
                else if (isSelected) btnClass += "border-red-500 bg-red-50 text-red-900";
                else btnClass += "border-slate-100 opacity-50 bg-slate-50 grayscale";
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleSelect(idx)} 
                  disabled={showExplanation} 
                  className={btnClass}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                      !showExplanation 
                        ? (isSelected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-400")
                        : (isCorrect ? "border-green-600 bg-green-600 text-white" : (isSelected ? "border-red-500 bg-red-500 text-white" : "border-slate-200 text-slate-300"))
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`text-lg font-medium leading-snug ${(!showExplanation && !isSelected) ? 'text-slate-700' : ''}`}>{opt}</span>
                  </div>
                  
                  {showExplanation && isCorrect && (
                    <div className="bg-green-100 p-1 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {showExplanation && isSelected && !isCorrect && (
                    <div className="bg-red-100 p-1 rounded-full">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-indigo-50/80 rounded-2xl border border-indigo-100 p-6 mb-8 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600 mt-1">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                   <h4 className="font-bold text-indigo-900 mb-2 text-lg">Explanation</h4>
                   <p className="text-slate-700 text-base leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex justify-between items-center">
           <div className="text-sm font-medium text-slate-500">
             Score: <span className="text-indigo-600 font-bold text-lg">{score}</span>
           </div>
           <button 
            disabled={!showExplanation}
            onClick={nextQuestion}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-md transform active:scale-95 ${showExplanation ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
          >
            {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
