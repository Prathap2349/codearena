import React from 'react';
import Editor from '@monaco-editor/react';
import { useCodeArena } from '../context/CodeArenaContext';
import { executeCode } from '../services/judge0';
import { Play, Send, Loader2 } from 'lucide-react';

const LANGUAGE_MAP = {
  "71": "python",
  "62": "java",
  "50": "c",
  "54": "cpp",
  "93": "javascript",
  "60": "go"
};

const LANGUAGES = [
  { id: "71", name: "Python 3" },
  { id: "62", name: "Java" },
  { id: "50", name: "C" },
  { id: "54", name: "C++" },
  { id: "93", name: "JavaScript" },
  { id: "60", name: "Go" }
];

const EditorPanel = () => {
  const { 
    code, setCode, 
    language, setLanguage, 
    problem, setResults, 
    isRunning, setIsRunning,
    setSubmissionHistory
  } = useCodeArena();

  const handleRunSample = async () => {
    setIsRunning(true);
    setResults([]);
    try {
      const res = await executeCode(code, language, problem.sampleInput, problem.sampleOutput);
      setResults([{
        id: "sample_1",
        isSample: true,
        input: problem.sampleInput,
        expected: problem.sampleOutput,
        passed: res.passed,
        actual: res.stdout || res.stderr || res.compile_output || "No Output",
        status: res.status
      }]);
    } catch (err) {
      setResults([{ error: err.message }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setResults([]);
    
    const allTests = problem.hiddenTestCases.map((tc, idx) => ({ 
      id: `Hidden #${idx + 1}`, 
      isSample: false, 
      ...tc 
    }));

    try {
      const newResults = [];
      for (const tc of allTests) {
        const res = await executeCode(code, language, tc.input, tc.expectedOutput);
        newResults.push({
          id: tc.id,
          isSample: tc.isSample,
          input: tc.input,
          expected: tc.expectedOutput,
          passed: res.passed,
          actual: res.stdout || res.stderr || res.compile_output || "No Output",
          status: res.status
        });
        
        // Anti-rate-limit logic for public API
        setResults([...newResults]); // show them compiling in real-time
        if (allTests.length > 1) {
          await new Promise(r => setTimeout(r, 1500));
        }
      }
      
      // Save to History
      const passedCount = newResults.filter(r => r.passed).length;
      setSubmissionHistory(prev => [{
        id: Date.now().toString(),
        title: problem.title,
        timestamp: new Date().toISOString(),
        language: LANGUAGE_MAP[language],
        passedCount: passedCount,
        totalCount: newResults.length,
        allPassed: passedCount === newResults.length
      }, ...prev]);

    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        setResults([{ error: err.message + "\n\nThis is usually caused by an adblocker (like Brave Shields), or Judge0's public demo rate limit temporarily dropping your connection. Try disabling adblockers or try again in a few seconds." }]);
      } else {
        setResults([{ error: err.message }]);
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f111a]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2b3040] bg-[#1a1d27]">
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#0f111a] border border-[#2b3040] text-sm text-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {LANGUAGES.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        
        <div className="flex gap-3">
          <button 
            onClick={handleRunSample}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium transition-colors bg-[#2b3040] text-slate-200 hover:bg-[#3b4256] disabled:opacity-50"
          >
            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} className="text-green-400" />}
            Run
          </button>
          
          <button 
            onClick={handleSubmit}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
          >
            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Submit
          </button>
        </div>
      </div>

      <div className="flex-1 w-full pt-4">
        <Editor
          height="100%"
          language={LANGUAGE_MAP[language]}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            roundedSelection: true
          }}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
