import React from "react";

function Content() {
  return (
    <>
      {/* --- Hero Section --- */}
      <section id="home" className="page-section hero-section">
        <div className="container flex-center">
          <h1 className="hero-title">🛡️ SecureDev Code Analyzer</h1>
          <p className="hero-description">
            Write, compile, and get AI-powered security suggestions for your C code.
          </p>
          <a href="#editor" className="cta-button">Get Started</a>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="suggestions" className="page-section features-section">
        <div className="container">
          <h2 className="section-title">Why Our Suggestions?</h2>
          <p className="features-description">
            Leverage cutting-edge AI to identify vulnerabilities and improve code quality automatically.
          </p>
          <div className="features-list">
            <ul>
              <li>Real-time security insights</li>
              <li>Best practices adherence</li>
              <li>Efficiency recommendations</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default Content;