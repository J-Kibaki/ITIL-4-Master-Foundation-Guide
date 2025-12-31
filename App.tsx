
import React, { useState } from 'react';
import { AppSection } from './types';
import Layout from './components/Layout';
import { ITIL_CONCEPTS, CORE_DEFINITIONS } from './constants';
import Quiz from './components/Quiz';
import { explainConcept } from './services/geminiService';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [explorerQuery, setExplorerQuery] = useState('');
  const [explorerResult, setExplorerResult] = useState('');
  const [loadingExplorer, setLoadingExplorer] = useState(false);

  const handleExplore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explorerQuery.trim()) return;
    setLoadingExplorer(true);
    try {
      const result = await explainConcept(explorerQuery);
      setExplorerResult(result);
    } catch (error) {
      setExplorerResult("Sorry, I couldn't process that request. Please try again.");
    } finally {
      setLoadingExplorer(false);
    }
  };

  // Simple formatter for basic markdown structure
  const formatAIResponse = (text: string) => {
    if (!text) return null;
    
    // Replace bold syntax **text** with HTML <b>text</b>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<b class="text-slate-900 font-bold">$1</b>');
    
    // Replace headers ### with HTML h3 styling
    formatted = formatted.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-indigo-700 mt-4 mb-2">$1</h3>');
    
    // Replace bullet points with styled list items (basic regex for single lines)
    formatted = formatted.replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1 relative pl-2 before:content-[\'•\'] before:absolute before:left-0 before:text-indigo-500">$1</li>');
    formatted = formatted.replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 relative pl-2 before:content-[\'•\'] before:absolute before:left-0 before:text-indigo-500">$1</li>');

    // Handle newlines
    formatted = formatted.replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const renderHome = () => (
    <div className="space-y-16 animate-fade-in">
      <section className="text-center py-16 px-6 bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-semibold mb-6 backdrop-blur-sm">Updated for ITIL 4</span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">Master ITIL 4 Foundation</h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed font-light">
            Your intelligent companion for service management. Practice with AI-generated scenarios, study key concepts, and prepare for certification with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button 
              onClick={() => setActiveSection(AppSection.QUIZ)}
              className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Start Practice Quiz
            </button>
            <button 
              onClick={() => setActiveSection(AppSection.CONCEPTS)}
              className="bg-indigo-600/50 backdrop-blur-md text-white border border-indigo-400/50 px-8 py-4 rounded-xl font-bold hover:bg-indigo-500/50 transition-all hover:-translate-y-1"
            >
              Review Core Concepts
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Detailed Syllabus</h3>
          <p className="text-slate-600 leading-relaxed">Comprehensive coverage of the Service Value System, Four Dimensions, and Guiding Principles.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered Quiz</h3>
          <p className="text-slate-600 leading-relaxed">Dynamic question generation means you never see the same test twice. Tailored to your learning needs.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Terminology Master</h3>
          <p className="text-slate-600 leading-relaxed">Master the specific AXELOS definitions for Utility, Warranty, Outcome, and other critical terms.</p>
        </div>
      </section>

      <section>
        <div className="bg-slate-900 rounded-[2rem] p-8 md:p-16 text-white overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <span className="inline-block px-4 py-1.5 bg-indigo-600 rounded-lg text-xs font-bold uppercase tracking-widest mb-6 shadow-lg">Exam Tip</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Focus on Co-creation</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                In ITIL 4, value is no longer just "delivered" to a customer. It is <strong>co-created</strong> through an active collaboration between the service provider and the service consumer. This is a fundamental shift from previous versions.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-4">
                  <div className="bg-indigo-500/20 p-1 rounded-full mt-1">
                     <svg className="w-4 h-4 text-indigo-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <span className="text-slate-200">Value = Perceived benefits, usefulness, and importance</span>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="bg-indigo-500/20 p-1 rounded-full mt-1">
                     <svg className="w-4 h-4 text-indigo-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <span className="text-slate-200">Outcomes are what the customer wants to achieve</span>
                </li>
              </ul>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-white/5 backdrop-blur-xl aspect-square rounded-3xl flex flex-col items-center justify-center p-12 border border-white/10 shadow-2xl max-w-sm w-full">
                 <div className="text-7xl mb-6">🤝</div>
                 <div className="text-2xl font-bold text-center">Service Relationship</div>
                 <div className="text-indigo-200 text-sm mt-3 font-medium uppercase tracking-wider">Provisioning + Consumption</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderConcepts = () => (
    <div className="space-y-16 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Key Framework Concepts</h2>
        <p className="text-xl text-slate-600 leading-relaxed">These are the foundational blocks you need to understand to pass the ITIL 4 Foundation exam. Master these to build your service management vocabulary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {ITIL_CONCEPTS.map((concept, i) => (
          <div key={i} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="flex items-center justify-between mb-6">
               <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{concept.icon}</div>
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
               </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-700 transition-colors">{concept.title}</h3>
            <p className="text-slate-600 mb-8 leading-relaxed flex-grow text-lg">{concept.description}</p>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Elements</h4>
              <div className="flex flex-wrap gap-2">
                {concept.keyPoints.map((point, pi) => (
                  <span key={pi} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 group-hover:border-indigo-100 group-hover:bg-indigo-50/50 transition-colors">
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 border-t border-slate-200 pt-16">
        <h3 className="text-3xl font-bold text-slate-900 mb-10 flex items-center">
          <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mr-4 text-sm font-bold shadow-lg shadow-indigo-200">A-Z</span>
          Essential Terminology
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_DEFINITIONS.map((def, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <h4 className="font-bold text-lg text-indigo-700 mb-3">{def.term}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{def.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAIExplorer = () => (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-6">AI Concept Explorer</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Ask about any ITIL concept, relationship, or practice and get a clear, formatted explanation powered by Gemini.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-slate-100">
        <div className="bg-gradient-to-r from-indigo-50 to-slate-50 p-3 border-b border-slate-100">
          <form onSubmit={handleExplore} className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="e.g., Explain the difference between Incident and Problem Management" 
              className="flex-grow bg-white border-0 px-6 py-4 rounded-xl shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-lg placeholder:text-slate-400"
              value={explorerQuery}
              onChange={(e) => setExplorerQuery(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loadingExplorer || !explorerQuery}
              className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${loadingExplorer || !explorerQuery ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
            >
              {loadingExplorer ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Thinking...</span>
                </span>
              ) : "Explain"}
            </button>
          </form>
        </div>

        <div className="p-8 md:p-10 min-h-[300px] bg-white">
          {explorerResult ? (
            <div className="prose prose-lg prose-indigo max-w-none text-slate-700 leading-relaxed">
               {formatAIResponse(explorerResult)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16 opacity-60">
               <div className="text-7xl mb-6 grayscale">💡</div>
               <p className="text-center italic text-lg font-medium">Try asking: "What are the 7 Guiding Principles?"</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center text-sm text-slate-400">
        AI responses are generated by Gemini and should be used as a study aid.
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case AppSection.HOME: return renderHome();
      case AppSection.CONCEPTS: return renderConcepts();
      case AppSection.QUIZ: return <Quiz />;
      case AppSection.AI_EXPLORER: return renderAIExplorer();
      default: return renderHome();
    }
  };

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderContent()}
    </Layout>
  );
};

export default App;
