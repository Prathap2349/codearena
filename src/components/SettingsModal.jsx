import React, { useState } from 'react';
import { useCodeArena } from '../context/CodeArenaContext';
import { Key, X } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
  const { judge0Key, setJudge0Key, geminiKey, setGeminiKey } = useCodeArena();

  const [localJKey, setLocalJKey] = useState(judge0Key);
  const [localGKey, setLocalGKey] = useState(geminiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    setJudge0Key(localJKey);
    setGeminiKey(localGKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1d27] border border-[#2b3040] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-[#2b3040] bg-[#1a1d27]/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Key size={20} className="text-blue-400" />
            API Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">RapidAPI Key (NO LONGER REQUIRED)</label>
            <input 
              type="password"
              value={localJKey}
              onChange={(e) => setLocalJKey(e.target.value)}
              placeholder="Not needed for Option 2..."
              disabled
              className="w-full bg-[#1a1d27] border border-[#2b3040] rounded-md px-3 py-2 text-sm text-slate-500 opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500">Judge0 is now using the public demo backend.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Google Gemini API Key</label>
            <input 
              type="password"
              value={localGKey}
              onChange={(e) => setLocalGKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-[#0f111a] border border-[#2b3040] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-slate-500">Required for AI explanations & test case generation.</p>
          </div>
        </div>

        <div className="p-4 border-t border-[#2b3040] bg-[#1a1d27]/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
