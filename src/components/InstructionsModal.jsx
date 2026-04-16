import React, { useState, useEffect } from 'react';
import { useCodeArena } from '../context/CodeArenaContext';
import { Info, X, ExternalLink, Code2, Play, Sparkles } from 'lucide-react';

const InstructionsModal = () => {
  const { geminiKey } = useCodeArena();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal if they haven't seen it, or if they have no Gemini key set yet
    const hasSeen = localStorage.getItem('hasSeenInstructions');
    if (!hasSeen || !geminiKey) {
      setIsOpen(true);
    }
  }, [geminiKey]);

  const handleClose = () => {
    localStorage.setItem('hasSeenInstructions', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1d27] border border-[#2b3040] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-[#2b3040] bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
            <Info size={22} className="text-blue-400" />
            Welcome to CodeArena
          </h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 text-slate-300 text-sm">
          <p className="text-base text-slate-200">
            CodeArena is your personal frontend competitive programming judge. By default, it uses a public backend to run code across dozens of languages for free.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg">
              <div className="bg-blue-500/20 p-2 rounded-full h-fit">
                <Sparkles size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 mb-1">Step 1: Set Up Free AI Features</h3>
                <p className="mb-2">CodeArena can magically generate test cases and explain your code errors using Google Gemini. To activate it:</p>
                <ol className="list-decimal list-inside space-y-1 mb-3 ml-1">
                  <li>Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">Google AI Studio <ExternalLink size={12}/></a></li>
                  <li>Click the Settings icon (<span className="text-slate-400">⚙️</span>) at the top right.</li>
                  <li>Paste your key. It's securely saved inside your browser.</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-4 p-4 border border-[#2b3040] bg-[#0f111a] rounded-lg">
              <div className="bg-emerald-500/10 p-2 rounded-full h-fit">
                <Code2 size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 mb-1">Step 2: Configure The Problem</h3>
                <p>On the left panel, you can type out a problem statement. Fill out your `Sample Input` and `Sample Output`. You can manually enter `Hidden Test Cases` or click the <span className="font-semibold text-purple-300 border border-purple-500/30 px-1 rounded mx-1 text-xs">🪄 Auto-Generate with AI</span> button to have Gemini instantly make them.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 border border-[#2b3040] bg-[#0f111a] rounded-lg">
              <div className="bg-indigo-500/10 p-2 rounded-full h-fit">
                <Play size={20} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 mb-1">Step 3: Test and Submit</h3>
                <p>Pick your language and write code in the center Editor. Click <span className="font-semibold text-slate-200 bg-[#2b3040] px-1 rounded mx-1 text-xs">Run</span> to test against public samples. Click <span className="font-semibold text-white bg-blue-600 px-1 rounded mx-1 text-xs">Submit</span> to test against fully hidden edge cases. If you fail, ask the AI why!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#2b3040] bg-[#1a1d27]/50 flex justify-end">
          <button 
            onClick={handleClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
          >
            Let's Start Coding!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
