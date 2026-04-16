import React, { useState } from 'react';
import { getAIExplanation } from '../services/gemini';
import { useCodeArena } from '../context/CodeArenaContext';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

const AIExplanation = ({ input, expected, actual }) => {
  const { code, geminiKey } = useCodeArena();
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExplanation = async () => {
    if (!geminiKey) {
      setError("Google Gemini API Key is missing. Set it in Settings.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await getAIExplanation(code, input, expected, actual, geminiKey);
      setExplanation(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!explanation && !loading && !error) {
    return (
      <button 
        onClick={fetchExplanation}
        className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/30 rounded-md text-sm text-indigo-300 transition-all font-medium"
      >
        <Sparkles size={16} className="text-purple-400" />
        Ask AI Why ❓
      </button>
    );
  }

  return (
    <div className="mt-3 p-3 rounded-md bg-[#0f111a] border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)]">
      {loading && (
        <div className="flex items-center gap-2 text-indigo-400 text-sm">
          <Loader2 size={16} className="animate-spin" />
          <span>Claude is analyzing your code...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {explanation && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-2 mb-2">
            <Sparkles size={16} className="text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">AI Explanation</span>
          </div>
          <div className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
            {explanation.split('```').map((part, index) => {
              if (index % 2 !== 0) {
                return (
                  <pre key={index} className="bg-[#1a1d27] border border-[#2b3040] p-2 rounded my-2 text-xs font-mono overflow-x-auto text-slate-300">
                    {part.replace(/^[a-z]+\n/, '')}
                  </pre>
                );
              }
              return <span key={index}>{part}</span>;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIExplanation;
