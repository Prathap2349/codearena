const encodeBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str || "")));
};

const decodeBase64 = (str) => {
  if (!str) return "";
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    return atob(str);
  }
};

export const executeCode = async (sourceCode, languageId, stdin, expectedOutput) => {
  const url = 'https://ce.judge0.com/submissions?base64_encoded=true&wait=true';
  const bodyData = {
    language_id: parseInt(languageId),
    source_code: encodeBase64(sourceCode),
    stdin: encodeBase64(stdin)
  };

  if (expectedOutput) {
    bodyData.expected_output = encodeBase64(expectedOutput);
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(bodyData)
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      status: data.status?.description || 'Unknown Error',
      stdout: decodeBase64(data.stdout),
      stderr: decodeBase64(data.stderr),
      compile_output: decodeBase64(data.compile_output),
      time: data.time,
      memory: data.memory,
      passed: data.status?.id === 3 
    };
  } catch (err) {
    console.error("Judge0 API Error:", err);
    throw err;
  }
};
