
import React from 'react';
import { AppSection } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection, setActiveSection }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between max-w-6xl">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveSection(AppSection.HOME)}
          >
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-100">ITIL 4 Master</span>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            <button 
              onClick={() => setActiveSection(AppSection.CONCEPTS)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === AppSection.CONCEPTS ? 'bg-slate-800 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              Key Concepts
            </button>
            <button 
              onClick={() => setActiveSection(AppSection.QUIZ)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === AppSection.QUIZ ? 'bg-slate-800 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              Practice Quiz
            </button>
            <button 
              onClick={() => setActiveSection(AppSection.AI_EXPLORER)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === AppSection.AI_EXPLORER ? 'bg-slate-800 text-indigo-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              AI Explorer
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="container mx-auto px-4 max-w-5xl text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} ITIL 4 Master Study Guide. Not affiliated with AXELOS.</p>
          <div className="mt-4 flex justify-center space-x-6">
             <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
             <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
             <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-20 px-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveSection(AppSection.HOME)}
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg w-16 ${activeSection === AppSection.HOME ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button 
          onClick={() => setActiveSection(AppSection.CONCEPTS)}
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg w-16 ${activeSection === AppSection.CONCEPTS ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          <span className="text-[10px] font-semibold">Learn</span>
        </button>
        <button 
          onClick={() => setActiveSection(AppSection.QUIZ)}
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg w-16 ${activeSection === AppSection.QUIZ ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          <span className="text-[10px] font-semibold">Quiz</span>
        </button>
        <button 
          onClick={() => setActiveSection(AppSection.AI_EXPLORER)}
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg w-16 ${activeSection === AppSection.AI_EXPLORER ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="text-[10px] font-semibold">AI</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;
