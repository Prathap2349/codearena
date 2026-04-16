import React, { useState } from 'react';
import { useCodeArena } from '../context/CodeArenaContext';
import { BookOpen, Plus, Trash2, Wand2, Loader2, AlertCircle } from 'lucide-react';
import { generateHiddenTestCases } from '../services/gemini';

const ProblemPanel = () => {
  const { problem, setProblem, geminiKey } = useCodeArena();
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const [testCount, setTestCount] = useState(3);

  const handleUpdate = (field, value) => {
    setProblem(prev => ({ ...prev, [field]: value }));
  };

  const addHiddenTest = () => {
    setProblem(prev => ({
      ...prev,
      hiddenTestCases: [...prev.hiddenTestCases, { input: '', expectedOutput: '' }]
    }));
  };

  const removeHiddenTest = (index) => {
    setProblem(prev => {
      const newCases = [...prev.hiddenTestCases];
      newCases.splice(index, 1);
      return { ...prev, hiddenTestCases: newCases };
    });
  };

  const updateHiddenTest = (index, field, value) => {
    setProblem(prev => {
      const newCases = [...prev.hiddenTestCases];
      newCases[index] = { ...newCases[index], [field]: value };
      return { ...prev, hiddenTestCases: newCases };
    });
  };

  const handleAutoGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const newCases = await generateHiddenTestCases(
        problem.title, 
        problem.description, 
        problem.sampleInput, 
        problem.sampleOutput, 
        geminiKey,
        testCount
      );
      setProblem(prev => ({
        ...prev,
        hiddenTestCases: newCases // Overwrite old test cases logically
      }));
    } catch (err) {
      setGenerateError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center gap-2 mb-2 border-b border-[#2b3040] pb-3">
        <BookOpen size={18} className="text-blue-400" />
        <h2 className="font-semibold text-sm tracking-wide uppercase text-slate-300">Problem Description</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
          <input 
            type="text" 
            value={problem.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="w-full bg-[#0f111a] border border-[#2b3040] rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
          <textarea 
            value={problem.description}
            onChange={(e) => handleUpdate('description', e.target.value)}
            rows={5}
            className="w-full bg-[#0f111a] border border-[#2b3040] rounded px-3 py-2 text-sm font-mono text-slate-300 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">Sample Input</label>
            <textarea 
              value={problem.sampleInput}
              onChange={(e) => handleUpdate('sampleInput', e.target.value)}
              rows={2}
              className="w-full bg-[#0f111a] border border-[#2b3040] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">Sample Output</label>
            <textarea 
              value={problem.sampleOutput}
              onChange={(e) => handleUpdate('sampleOutput', e.target.value)}
              rows={2}
              className="w-full bg-[#0f111a] border border-[#2b3040] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#2b3040]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300">Hidden Test Cases</h3>
          <button 
            onClick={addHiddenTest}
            className="flex items-center gap-1 text-xs bg-[#2b3040] hover:bg-[#3b4256] px-2 py-1 rounded transition-colors"
          >
            <Plus size={14} /> Add Test
          </button>
        </div>
        
        {generateError && (
          <div className="flex gap-2 items-center text-red-400 text-xs mt-2 mb-2 bg-red-900/20 p-2 rounded">
            <AlertCircle size={14} /> {generateError}
          </div>
        )}

        {problem.sampleInput && problem.sampleOutput && (
          <div className="flex gap-2 mb-3">
            <input 
              type="number" 
              min="1" 
              max="30"
              value={testCount}
              onChange={(e) => setTestCount(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-16 bg-[#0f111a] border border-[#2b3040] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-purple-500 text-center"
              title="Number of test cases to generate (Max 30)"
            />
            <button 
              onClick={handleAutoGenerate}
              disabled={generating}
              className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 rounded text-xs text-purple-300 transition-all font-medium disabled:opacity-50"
            >
              {generating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} className="text-purple-400" />}
              {generating ? "Generating..." : "Auto-Generate with AI"}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {problem.hiddenTestCases.map((tc, idx) => (
            <div key={idx} className="bg-[#0f111a] border border-[#2b3040] rounded p-3 relative group">
              <button 
                onClick={() => removeHiddenTest(idx)}
                className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              <div className="flex gap-3 mt-1">
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Input</label>
                  <textarea 
                    value={tc.input}
                    onChange={(e) => updateHiddenTest(idx, 'input', e.target.value)}
                    rows={1}
                    className="w-full bg-transparent border-b border-dashed border-[#2b3040] focus:border-blue-500 text-xs font-mono py-1 focus:outline-none"
                    placeholder="Input..."
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Expected Output</label>
                  <textarea 
                    value={tc.expectedOutput}
                    onChange={(e) => updateHiddenTest(idx, 'expectedOutput', e.target.value)}
                    rows={1}
                    className="w-full bg-transparent border-b border-dashed border-[#2b3040] focus:border-blue-500 text-xs font-mono py-1 focus:outline-none"
                    placeholder="Output..."
                  />
                </div>
              </div>
            </div>
          ))}
          {problem.hiddenTestCases.length === 0 && (
            <p className="text-xs text-slate-500 italic text-center py-2">No hidden test cases configured.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPanel;
