import React from 'react';
import { useCodeArena } from '../context/CodeArenaContext';
import AIExplanation from './AIExplanation';
import { CheckCircle2, XCircle, LayoutList, Loader2 } from 'lucide-react';

const ResultsPanel = () => {
  const { results, isRunning } = useCodeArena();

  if (isRunning) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 h-full">
        <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
        <p className="text-sm font-medium">Executing code...</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 h-full">
        <LayoutList size={48} className="mb-4 opacity-50" />
        <p className="text-sm font-medium">Run or submit to see results here.</p>
      </div>
    );
  }

  if (results[0]?.error) {
    return (
      <div className="p-4 flex-1 h-full font-sans">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <XCircle size={18} /> Error
          </h3>
          <p className="text-sm whitespace-pre-wrap">{results[0].error}</p>
        </div>
      </div>
    );
  }

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount;

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="p-4 border-b border-[#2b3040] bg-[#1a1d27] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-300">Test Results</h2>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${allPassed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {passedCount} / {totalCount} Passed
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto w-full">
        {results.map((res, idx) => (
          <div 
            key={idx} 
            className={`rounded-lg border overflow-hidden transition-all duration-300 animate-in slide-in-from-right-4 w-full`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`px-4 py-2 border-b flex items-center justify-between ${res.passed ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className="flex items-center gap-2">
                {res.passed ? (
                  <CheckCircle2 size={16} className="text-green-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full" />
                ) : (
                  <XCircle size={16} className="text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] rounded-full" />
                )}
                <span className="font-semibold text-sm text-slate-200">
                  {res.id}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-[#0f111a] px-1.5 py-0.5 rounded border border-[#2b3040]">
                  {res.status}
                </span>
              </div>
            </div>

            <div className={`p-4 bg-[#1a1d27] border-l-4 ${res.passed ? 'border-l-green-500' : 'border-l-red-500'}`}>
              {(!res.passed || res.isSample) && (
                <div className="space-y-3 mb-2 w-full">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Input</span>
                    <pre className="bg-[#0f111a] p-2 rounded text-xs font-mono mt-1 text-slate-300 border border-[#2b3040] overflow-x-auto w-full">{res.input}</pre>
                  </div>
                  <div className="flex gap-3 mt-3 w-full">
                    <div className="flex-1 w-0">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Expected</span>
                      <pre className="bg-[#0f111a] p-2 rounded text-xs font-mono mt-1 text-slate-300 border border-[#2b3040] overflow-x-auto w-full">{res.expected}</pre>
                    </div>
                    <div className="flex-1 w-0">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Actual</span>
                      <pre className={`p-2 rounded text-xs font-mono mt-1 border overflow-x-auto w-full ${res.passed ? 'bg-green-900/20 border-green-900 text-green-300' : 'bg-red-900/20 border-red-900 text-red-300'}`}>
                        {res.actual || "\n"}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {res.passed && !res.isSample && (
                <p className="text-xs text-slate-400 italic">Outputs hidden for hidden test case.</p>
              )}

              {!res.passed && (
                <AIExplanation 
                  input={res.input} 
                  expected={res.expected} 
                  actual={res.actual} 
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPanel;
