// Cache the array of working models
let validModelCache = [];

const initModels = async (apiKey) => {
  if (validModelCache.length > 0) return validModelCache;
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  if (!response.ok) {
    throw new Error("Invalid Gemini API Key or unable to list models.");
  }
  
  const data = await response.json();
  if (!data.models) {
    throw new Error("No models returned from Gemini API.");
  }

  // Find models that support generateContent
  const validModels = data.models.filter(m => 
    m.supportedGenerationMethods && 
    m.supportedGenerationMethods.includes("generateContent") &&
    m.name.includes("gemini")
  );

  if (validModels.length === 0) {
    throw new Error("Your API key does not have access to any text generation models.");
  }

  // Sort them: Prioritize "flash" (fastest/most reliable), then "pro", then the others
  validModelCache = validModels.sort((a, b) => {
    const aFlash = a.name.includes("flash");
    const bFlash = b.name.includes("flash");
    if (aFlash && !bFlash) return -1;
    if (!aFlash && bFlash) return 1;
    return 0;
  }).map(m => m.name);
  
  return validModelCache;
};

// Unified fetcher that automatically retries the next model if one is overloaded!
const executePromptWithFallback = async (apiKey, prompt) => {
  const models = await initModels(apiKey);
  let lastError = null;

  for (const modelName of models) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (!response.ok) {
        const errData = await response.json();
        const errMsg = errData.error?.message || "Unknown error";
        // If our key is entirely invalid, don't keep looping
        if (errMsg.includes("API key not valid")) {
          throw new Error("API key not valid");
        }
        // Otherwise, throw locally so the catch block triggers the next loop iteration
        throw new Error(errMsg);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (e) {
      console.warn(`Model ${modelName} failed:`, e.message);
      lastError = e;
      if (e.message.includes("API key not valid")) {
        break; // Stop immediately for critical authentication failures
      }
    }
  }

  throw new Error(`All Google AI models are currently overloaded. Last Error: ${lastError?.message || "Unknown"}`);
};

export const getAIExplanation = async (code, input, expectedOutput, actualOutput, apiKey) => {
  if (!apiKey) throw new Error("Gemini API Key is missing. Please set it in Settings.");

  const prompt = `I am testing my code on a competitive programming judge. One of my test cases failed. 

Here is my code:
\`\`\`
${code}
\`\`\`

Here was the test case input:
\`\`\`
${input}
\`\`\`

The expected output is:
\`\`\`
${expectedOutput}
\`\`\`

But my actual output got this result/error:
\`\`\`
${actualOutput}
\`\`\`

Could you please explain what went wrong and how I can fix it? Keep the explanation concise and instructional. Avoid rewriting the entire code if a small fix is enough. Use markdown for any code blocks.`;

  return await executePromptWithFallback(apiKey, prompt);
};

export const generateHiddenTestCases = async (title, description, sampleInput, sampleOutput, apiKey, count = 3) => {
  if (!apiKey) throw new Error("Gemini API Key is missing. Please set it in Settings.");

  const prompt = `You are a competitive programming judge backend. I need you to generate ${count} additional hidden test cases for a programming problem based on its description and sample input/output.
  
Problem Title: ${title}
Description: ${description}
Sample Input: ${sampleInput}
Sample Output: ${sampleOutput}

Please generate exactly ${count} test cases. Edge cases or typical boundaries are appreciated.
Respond ONLY with a valid JSON array matching this exact schema, do not include markdown blocks or any other explanation text:
[
  { "input": "...", "expectedOutput": "..." },
  { "input": "...", "expectedOutput": "..." },
  { "input": "...", "expectedOutput": "..." }
]
`;

  const text = await executePromptWithFallback(apiKey, prompt);
  const cleanText = text.trim();
  
  // Safely extract JSON array even if Gemini adds conversational text
  const match = cleanText.match(/\[[\s\S]*\]/);
  if (!match) {
    throw new Error("Could not parse test cases from AI response. Received:\n" + cleanText);
  }
  
  return JSON.parse(match[0]);
};
