// src/App.jsx
import React from 'react';
import './App.css'; // Global styles
import Navbar from '../components/navbar/Navbar.jsx';
import Content from '../components/content/Content.jsx'; // This will contain Home and Suggestions
import Compilation from '../components/compilation/Compilation.jsx'; // This will be the Editor
import Footer from '../components/footer/Footer.jsx';

function App() {
  return (
    <div className="App">
      <Navbar />

      {/* Content component now directly uses IDs for navigation */}
      <Content />

      {/* The Compilation component is the core "Editor" section */}
      {/* This section will have padding from .page-section in App.css */}
      <section id="editor" className="page-section editor-area">
        <div className="container">
          <Compilation />
        </div>
      </section>

      {/* The About section, now directly in App.jsx */}
      {/* This section will have padding from .page-section in App.css */}
      <section id="about" className="page-section about-area">
        <div className="container">
          <h2>About This Project</h2>
          <p>
            This project is an interactive Secure C Code Compiler and AI Assistant built to help developers write, test, and improve C code with a focus on security. The platform allows users to write or upload C code, compile it in real time, and get AI-powered suggestions for improving its security and reliability.
          </p>
          <h3>Key Features:</h3>
          <ul className="about-features-list">
            <li><strong>✅ Write or upload C code directly in the browser</strong></li>
            <li><strong>⚙️ Compile code using a backend API</strong></li>
            <li><strong>🤖 Get real-time AI suggestions using Google Gemini API</strong></li>
            <li><strong>🔍 Automatically detect and suggest fixes for potential security vulnerabilities</strong></li>
            <li><strong>🧠 Designed with educational and security research use cases in mind</strong></li>
          </ul>
          <p>
            This tool is especially useful for students, CTF participants, and security-focused developers who want to ensure their code is clean, secure, and well-structured.
          </p>
        </div>
      </section>

      {/* The Footer component is now a direct child of .App, allowing Footer.css to control its spacing. */}
      <Footer />
    </div>
  );
}

export default App;
