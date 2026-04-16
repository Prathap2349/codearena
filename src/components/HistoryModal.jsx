import React from 'react';
import { useCodeArena } from '../context/CodeArenaContext';
import { History, X, CheckCircle, XCircle } from 'lucide-react';

const HistoryModal = ({ isOpen, onClose }) => {
  const { submissionHistory, currentUser } = useCodeArena();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1d27] border border-[#2b3040] rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-[#2b3040] bg-[#1a1d27]/50 shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200">
            <History size={20} className="text-blue-400" />
            {currentUser}'s History
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 bg-[#0f111a]">
          {submissionHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
              <History size={48} className="opacity-20" />
              <p>No submissions found for <span className="font-semibold text-slate-400">{currentUser}</span>.</p>
              <p className="text-xs">Click "Submit" on a problem to record history!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...submissionHistory].reverse().map((record) => (
                <div key={record.id} className="bg-[#1a1d27] border border-[#2b3040] rounded-lg p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <h3 className="font-medium text-slate-200 mb-1">{record.title}</h3>
                    <div className="text-xs text-slate-500 flex gap-3">
                      <span>{new Date(record.timestamp).toLocaleString()}</span>
                      <span className="uppercase tracking-wider text-slate-400">{record.language}</span>
                      <span>{record.passedCount}/{record.totalCount} Cases</span>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium border ${record.allPassed ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {record.allPassed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {record.allPassed ? 'Accepted' : 'Failed Tests'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
