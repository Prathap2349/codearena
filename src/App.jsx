import React, { useState } from 'react';
import ProblemPanel from './components/ProblemPanel';
import EditorPanel from './components/EditorPanel';
import ResultsPanel from './components/ResultsPanel';
import SettingsModal from './components/SettingsModal';
import InstructionsModal from './components/InstructionsModal';
import LoginScreen from './components/LoginScreen';
import HistoryModal from './components/HistoryModal';
import { useCodeArena } from './context/CodeArenaContext';
import { Settings, Terminal, Info, LogOut, History as HistoryIcon, User } from 'lucide-react';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const { currentUser, logout } = useCodeArena();

  // Route guarding: if there is no session string, present the Login portal
  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f111a] text-slate-200 overflow-hidden font-sans">
      <header className="h-14 border-b border-[#2b3040] bg-[#1a1d27] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="text-blue-500" size={24} />
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            CodeArena
          </h1>
          <span className="hidden md:flex ml-4 text-xs font-medium text-slate-500 items-center gap-1 bg-[#0f111a] px-2 py-1 rounded-md border border-[#2b3040]">
            <User size={12} /> {currentUser}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-[#2b3040] rounded-md transition-colors flex items-center gap-1 text-sm font-medium"
            title="Execution History"
          >
            <HistoryIcon size={18} />
            <span className="hidden sm:inline">History</span>
          </button>

          <button 
            onClick={() => {
              localStorage.removeItem('hasSeenInstructions');
              window.location.reload(); 
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-[#2b3040] rounded-md transition-colors flex items-center gap-1 text-sm font-medium"
            title="Help / Instructions"
          >
            <Info size={18} />
            <span className="hidden sm:inline">Guide</span>
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-[#2b3040] rounded-md transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </button>

          <div className="w-px h-5 bg-[#2b3040] mx-1"></div>

          <button 
            onClick={logout}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors flex items-center gap-1 text-sm font-medium"
            title="Logout and wipe session"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-[30%] border-r border-[#2b3040] flex flex-col bg-[#1a1d27] overflow-y-auto">
          <ProblemPanel />
        </div>

        <div className="w-[40%] flex flex-col relative z-0">
          <EditorPanel />
        </div>

        <div className="w-[30%] border-l border-[#2b3040] flex flex-col bg-[#1a1d27] overflow-y-auto relative z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.3)]">
          <ResultsPanel />
        </div>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <InstructionsModal />
    </div>
  );
}

export default App;
