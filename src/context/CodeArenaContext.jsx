import React, { createContext, useState, useEffect, useContext } from 'react';

const CodeArenaContext = createContext();

const defaultProblem = {
  title: "Sum of Two Numbers",
  description: "Write a program that takes two space-separated integers as input and prints their sum.\n\nInput: Two integers A and B\nOutput: One integer, the sum of A and B.",
  sampleInput: "3 5",
  sampleOutput: "8",
  hiddenTestCases: [
    { input: "10 20", expectedOutput: "30" },
    { input: "-5 5", expectedOutput: "0" },
    { input: "100 -50", expectedOutput: "50" }
  ]
};

const defaultCodes = {
  "71": "def solve():\n    a, b = map(int, input().split())\n    print(a + b)\n\nif __name__ == '__main__':\n    solve()",
  "62": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int a = scanner.nextInt();\n        int b = scanner.nextInt();\n        System.out.println(a + b);\n    }\n}",
  "50": "#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf(\"%d %d\", &a, &b);\n    printf(\"%d\\n\", a + b);\n    return 0;\n}",
  "54": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}",
  "93": "const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');\nconst [a, b] = input[0].split(' ').map(Number);\nconsole.log(a + b);",
  "60": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var a, b int\n    fmt.Scan(&a, &b)\n    fmt.Println(a + b)\n}"
};

export const CodeArenaProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => sessionStorage.getItem('currentUser') || null);
  
  const [problem, setProblem] = useState(defaultProblem);
  const [language, setLanguage] = useState("71"); 
  const [code, setCode] = useState(defaultCodes["71"]);
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // User isolated state
  const [judge0Key, setJudge0Key] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [submissionHistory, setSubmissionHistory] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setJudge0Key(localStorage.getItem(`judge0Key_${currentUser}`) || '');
      setGeminiKey(localStorage.getItem(`geminiKey_${currentUser}`) || '');
      const hist = localStorage.getItem(`history_${currentUser}`);
      setSubmissionHistory(hist ? JSON.parse(hist) : []);
    }
  }, [currentUser]);

  // Persist keys scoped to this particular username
  useEffect(() => {
    if (currentUser) localStorage.setItem(`judge0Key_${currentUser}`, judge0Key);
  }, [judge0Key, currentUser]);

  useEffect(() => {
    if (currentUser) localStorage.setItem(`geminiKey_${currentUser}`, geminiKey);
  }, [geminiKey, currentUser]);

  useEffect(() => {
    if (currentUser) localStorage.setItem(`history_${currentUser}`, JSON.stringify(submissionHistory));
  }, [submissionHistory, currentUser]);

  const handleLanguageChange = (newLangId) => {
    setLanguage(newLangId);
    setCode(defaultCodes[newLangId] || "");
  };

  const login = (username) => {
    const safeName = username.trim().toLowerCase();
    sessionStorage.setItem('currentUser', safeName);
    setCurrentUser(safeName);
  };

  const logout = () => {
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
    setGeminiKey('');
    setJudge0Key('');
    setSubmissionHistory([]);
    setResults([]);
  };

  return (
    <CodeArenaContext.Provider value={{
      currentUser, login, logout,
      problem, setProblem,
      language, setLanguage: handleLanguageChange,
      code, setCode,
      results, setResults,
      isRunning, setIsRunning,
      judge0Key, setJudge0Key,
      geminiKey, setGeminiKey,
      submissionHistory, setSubmissionHistory
    }}>
      {children}
    </CodeArenaContext.Provider>
  );
};

export const useCodeArena = () => useContext(CodeArenaContext);
