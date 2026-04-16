import React, { useState } from 'react';
import { useCodeArena } from '../context/CodeArenaContext';
import { Terminal, Lock } from 'lucide-react';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const { login } = useCodeArena();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[80px] -z-10 pointer-events-none" />

      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-[#1a1d27]/80 backdrop-blur-md border border-[#2b3040] rounded-2xl shadow-2xl p-8">
          
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Terminal className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">CodeArena</h1>
            <p className="text-sm text-slate-400 text-center">Enter a username to securely isolate your API keys & submission history.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Prathap"
                  className="w-full bg-[#0f111a] border border-[#2b3040] rounded-lg px-4 py-3 pl-10 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
            >
              Enter Arena
            </button>
          </form>
          
        </div>
        <p className="text-center text-xs text-slate-600 mt-6 flex items-center justify-center gap-1">
           Sessions are locally isolated directly on this browser.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
