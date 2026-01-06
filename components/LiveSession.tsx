import React, { useState, useEffect, useRef } from 'react';
import { connectLiveSession } from '../services/liveService';
import AudioVisualizer from './AudioVisualizer';

const LiveSession: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for audio playback management
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const disconnectRef = useRef<() => Promise<void> | void>();

  useEffect(() => {
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const startSession = async () => {
      try {
        const session = await connectLiveSession(
          (audioBuffer) => {
            // Play audio
            const ctx = outputAudioContextRef.current;
            if (!ctx) return;
            
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            
            const currentTime = ctx.currentTime;
            // Ensure gapless playback
            const startTime = Math.max(currentTime, nextStartTimeRef.current);
            source.start(startTime);
            nextStartTimeRef.current = startTime + audioBuffer.duration;
          },
          () => {
             setIsConnected(false);
          },
          (err) => {
             setError("Connection failed. Microphone access denied or network error.");
             console.error(err);
          }
        );
        disconnectRef.current = session.disconnect;
        setIsConnected(true);
      } catch (e) {
        setError("Could not start session.");
      }
    };

    startSession();

    return () => {
        if (disconnectRef.current) disconnectRef.current();
        outputAudioContextRef.current?.close();
    };
  }, []);

  const handleEndSession = async () => {
      if (disconnectRef.current) {
          await disconnectRef.current();
      }
      onClose();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Voice Coaching</h2>
        <p className="text-slate-400 text-sm">Real-time Strategy & Tactics (Darija/English)</p>
      </div>

      <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden">
         {/* Animated Glow */}
         {isConnected && (
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent animate-pulse-slow"></div>
         )}
         
         <div className="flex flex-col items-center space-y-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isConnected ? 'bg-gold-500/20 shadow-[0_0_30px_rgba(234,179,8,0.3)]' : 'bg-slate-700'}`}>
                <svg className={`w-10 h-10 ${isConnected ? 'text-gold-500' : 'text-slate-500'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
            </div>

            <AudioVisualizer isActive={isConnected} />
            
            {error ? (
                <div className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg">{error}</div>
            ) : (
                <div className="text-slate-300 font-mono text-sm">
                    {isConnected ? "Listening..." : "Connecting..."}
                </div>
            )}
         </div>
      </div>

      <button 
        onClick={handleEndSession}
        className="px-8 py-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 transition-all font-semibold"
      >
        End Session
      </button>
    </div>
  );
};

export default LiveSession;