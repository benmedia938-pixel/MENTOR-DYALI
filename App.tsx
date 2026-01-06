import React, { useState } from 'react';
import { AppView } from './types';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import LiveSession from './components/LiveSession';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [userName] = useState("Entrepreneur"); // Simple state for demo

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard userName={userName} onNavigate={(view) => setCurrentView(view as AppView)} />;
      case AppView.CHAT:
        return <ChatInterface />;
      case AppView.LIVE_SESSION:
        return <LiveSession onClose={() => setCurrentView(AppView.DASHBOARD)} />;
      default:
        return <Dashboard userName={userName} onNavigate={(view) => setCurrentView(view as AppView)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
       {/* Mobile/Desktop Wrapper */}
      <div className="w-full max-w-md h-[100dvh] bg-slate-900 shadow-2xl overflow-hidden relative flex flex-col md:rounded-3xl md:h-[90vh] md:border-8 md:border-slate-800">
        
        {/* Navigation Bar (Top) */}
        {currentView !== AppView.DASHBOARD && (
          <div className="h-16 flex items-center px-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md z-10 absolute top-0 w-full">
            <button 
              onClick={() => setCurrentView(AppView.DASHBOARD)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="ml-2 font-semibold text-white">
                {currentView === AppView.CHAT ? 'Strategic Chat' : 'Live Coaching'}
            </span>
          </div>
        )}

        {/* Content Area */}
        <div className={`flex-1 overflow-hidden relative ${currentView !== AppView.DASHBOARD ? 'pt-16' : ''}`}>
          {renderView()}
        </div>

        {/* Bottom Navigation (Only visible on Dashboard for simplicity in this demo, but could be persistent) */}
        {currentView === AppView.DASHBOARD && (
             <div className="h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-6 absolute bottom-0 w-full">
                <button className="flex flex-col items-center text-gold-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span className="text-[10px] mt-1 font-medium">Home</span>
                </button>
                <button className="flex flex-col items-center text-slate-500 hover:text-slate-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    <span className="text-[10px] mt-1 font-medium">Stats</span>
                </button>
                 <button className="flex flex-col items-center text-slate-500 hover:text-slate-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="text-[10px] mt-1 font-medium">Profile</span>
                </button>
             </div>
        )}
      </div>
    </div>
  );
};

export default App;
