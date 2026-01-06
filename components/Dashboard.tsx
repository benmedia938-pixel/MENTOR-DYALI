import React from 'react';
import { INITIAL_TASKS } from '../constants';
import { Metric } from '../types';

interface DashboardProps {
  userName: string;
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, onNavigate }) => {
  const metrics: Metric[] = [
    { label: 'Weekly Revenue', value: '$1,250', trend: 'up' },
    { label: 'Leads (7d)', value: '142', trend: 'up' },
    { label: 'Conv. Rate', value: '3.2%', trend: 'neutral' },
  ];

  return (
    <div className="p-6 space-y-8 overflow-y-auto h-full pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, {userName}</h1>
          <p className="text-slate-400 text-sm">Let's dominate the market today.</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gold-500 flex items-center justify-center font-bold text-slate-900 border-2 border-slate-700">
           {userName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m, i) => (
          <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
            <p className="text-slate-400 text-xs uppercase font-semibold">{m.label}</p>
            <p className="text-xl font-bold text-white mt-1">{m.value}</p>
            <span className={`text-xs ${m.trend === 'up' ? 'text-green-400' : 'text-slate-500'}`}>
              {m.trend === 'up' ? '↗ Increasing' : '• Stable'}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions (Glossy Buttons) */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('CHAT')}
          className="glossy bg-slate-800/50 p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 hover:bg-slate-800 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <span className="font-semibold text-white">Strategic Chat</span>
        </button>

        <button 
          onClick={() => onNavigate('LIVE_SESSION')}
          className="glossy bg-slate-800/50 p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 hover:bg-slate-800 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center group-hover:scale-110 transition-transform">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
          <span className="font-semibold text-white">Live Coaching</span>
        </button>
      </div>

      {/* Daily Tactical Sprint */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
        <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Daily Tactical Sprint
        </h3>
        <div className="space-y-3">
            {INITIAL_TASKS.map(task => (
                <div key={task.id} className="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer">
                    <div className={`w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center ${task.completed ? 'bg-gold-500 border-gold-500' : ''}`}>
                        {task.completed && <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {task.title}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
