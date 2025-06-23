import React, { useState } from "react";
import "./Compilation.css"; // Assuming you have this CSS file for styling

function Compilation() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [compileError, setCompileError] = useState("");
  const [suggestError, setSuggestError] = useState("");

  // IMPORTANT: With port forwarding, your Windows frontend connects to localhost.
  // The VM software handles forwarding to the Kali VM's internal IP.
  const BACKEND_BASE_URL = "localhot:8000"; 
  // <--- !!! REPLACE THIS !!!

  // Clean Gemini's output
  const cleanGeminiCodeOutput = (text) => {
    // Regex to extract code from a Markdown code block
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)\n```/;
    const match = text.match(codeBlockRegex);
    return match && match[1] ? match[1].trim() : text.trim();
  };

  // Handle code file upload and trigger backend analysis
  const handleFileUpload = async (e) => {
    setCompileError("");
    setSuggestError("");
    setOutput("");
    setSuggestion("");

    const file = e.target.files[0];
    if (!file) return;

    setIsCompiling(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BACKEND_BASE_URL}/analyze-file`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const text = (data.stdout || "") + (data.stderr ? "\nErrors:\n" + data.stderr : "");
      setOutput(text);

      const reader = new FileReader();
      reader.onload = () => setCode(reader.result);
      reader.readAsText(file);
    } catch (err) {
      console.error("File upload error:", err);
      setCompileError("Failed to upload and analyze file. Check network and server logs.");
    } finally {
      setIsCompiling(false);
    }
  };

  // Send code to backend for compilation analysis
  const handleCompile = async () => {
    setIsCompiling(true);
    setCompileError("");
    setOutput("");

    if (!code.trim()) {
      setCompileError("Please enter some C code to compile.");
      setIsCompiling(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/analyze-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error("Invalid JSON response from backend.");
      }

      if (!res.ok) {
        const errorMessage = data.detail || "Compilation failed. Check stderr for details.";
        setCompileError(errorMessage);
      }

      const text =
        (data.stdout || "") +
        (data.stderr ? "\nErrors:\n" + data.stderr : "");
      setOutput(text);

    } catch (err) {
      console.error("Compilation fetch error:", err);
      setCompileError(`Failed to connect to backend: ${err.message}. Ensure the FastAPI server is running on ${BACKEND_BASE_URL}.`);
      setOutput("Could not reach compiler backend.");
    } finally {
      setIsCompiling(false);
    }
  };


  // Request secure suggestion using Gemini
  const handleSuggest = async () => {
    setIsSuggesting(true);
    setSuggestError("");
    setSuggestion("");

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      setSuggestError("Gemini API key is missing. Check your .env configuration.");
      setSuggestion("API key not found.");
      setIsSuggesting(false);
      return;
    }

    if (!code.trim()) {
      setSuggestError("Enter C code in the editor to get suggestions.");
      setIsSuggesting(false);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert C programmer and security analyst.
Review the code and return only the improved version, as a complete runnable C code block. No explanation or intro text. Focus on security and best practices.

Here is the original C code:
\`\`\`c
${code}
\`\`\``,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.candidates?.[0]?.content) {
        let msg = "Suggestion failed. No content received.";
        if (data.error?.message) {
          msg = `Gemini API error: ${data.error.message}`;
        }
        setSuggestError(msg);
        setSuggestion("No suggestion received.");
        return;
      }

      const rawText = data.candidates[0].content.parts?.[0]?.text || "";
      const cleaned = cleanGeminiCodeOutput(rawText);
      setSuggestion(cleaned || "No specific suggestion received.");
    } catch (err) {
      console.error("Gemini fetch error:", err);
      setSuggestError(`Gemini connection error: ${err.message}. Check your API key and network.`);
      setSuggestion("Suggestion failed.");
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="compilation-container">
      <div className="editor-section">
        <h2 className="heading">Code Editor</h2>
        <textarea
          className="code-input"
          rows={15}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your secure C code here..."
          spellCheck="false" // Disable spell check for code editor
        />

        <div className="actions">
          <label htmlFor="file-upload" className="file-input-label">
            Upload C File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".c"
            onChange={handleFileUpload}
            className="file-input"
          />
          <button className="primary-btn" onClick={handleCompile} disabled={isCompiling}>
            {isCompiling ? "Compiling..." : "Compile"}
          </button>
          <button className="secondary-btn" onClick={handleSuggest} disabled={isSuggesting}>
            {isSuggesting ? "Suggesting..." : "Suggest Better Code"}
          </button>
        </div>

        {compileError && <div className="error-message">{compileError}</div>}
        {suggestError && <div className="error-message">{suggestError}</div>}

        {suggestion && (
          <div className="suggestion-box">
            <strong>Suggestion:</strong>
            <pre className="code-suggestion">{suggestion}</pre>
            <button
              className="download-btn"
              onClick={() => {
                const blob = new Blob([suggestion], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "suggested_code.c";
                document.body.appendChild(a); // Append to body to ensure it's in the DOM
                a.click();
                document.body.removeChild(a); // Clean up
                URL.revokeObjectURL(url);
              }}
            >
              Download Suggested Code
            </button>
          </div>
        )}
      </div>

      <div className="output-section">
        <h2 className="heading">Output</h2>
        <div className="output-box">
          <pre>{output || (isCompiling ? "Waiting for compiler..." : "Compiler output will appear here...")}</pre>
        </div>
      </div>
    </div>
  );
}

export default Compilation;
