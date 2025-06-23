// src/components/footer/Footer.jsx
import React from "react";
// Import icons from react-icons/fa (Font Awesome)
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import "./Footer.css";

const Footer = () => {
  return (
    // Main footer container with a semantic tag
    <footer className="footer">
      {/* Top section of the footer, acting as a flex container for sections */}
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h3>About us</h3>
          <p>
            Passionate developers creating clean and modern web experiences.
            Always learning and building cool stuff!
          </p>
        </div>

        {/* Social Links Section */}
        <div className="footer-section social">
          <h3>Connect with me</h3>
          <div className="social-icons">
            {/* GitHub Icon Link */}
            <a
              href="https://github.com/Akarsh-2004"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            {/* LinkedIn Icon Link */}
            <a
              href="https://www.linkedin.com/in/akarsh-saklani-466971285/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            {/* Twitter (X) Icon Link */}
            <a
              href="https://x.com/AkarshSaklani"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            {/* Email Icon Link */}
            <a href="mailto:Akarshsaklani222@gmail.com" aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact">
          <h3>Contact</h3>
          <p>Email: Akarshsaklani222@gmail.com</p>
          <p>Alt Email : AkarshSaklanics@gmail.com</p>
          <p>Phone: +91 9805646641</p>
        </div>
      </div>

      {/* Bottom copyright section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Akarsh Saklani. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
