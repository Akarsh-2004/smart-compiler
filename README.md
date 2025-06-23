# 🛡️ Smart Secure C Compiler

A **secure C compiler** that analyzes and compiles C source code, detecting vulnerabilities like:
- Dead code after `return`
- Format string issues
- Type mismatches
- Uninitialized variables
- Control flow anomalies

Built with:
- ⚙️ C (core compiler)
- 🚀 FastAPI (Python backend)
- 💻 Optional: React (frontend)

---

## 📁 Project Structure

smart-compiler/
├── secure_compiler # Compiled C binary (via Flex/Bison)
├── api.py # FastAPI backend server
├── temp.c # Temp file for uploaded/analyzed code
├── build/ # (Optional) React frontend build folder
└── README.md


## 🚀 Features

- Upload or input C code
- Analyze code for secure compilation
- Returns detailed compiler output (stdout + stderr)
- Exposed via REST API
- Supports frontend integration (React, Postman, etc.)

---

## 🖥️ Requirements

- Linux OS (Kali/Debian-based preferred)
- Python 3.10+
- Flex & Bison (for compiling the secure compiler)
- pip + virtualenv (recommended)

---

## ⚙️ Setup Instructions

### 📦 1. Clone & Setup Backend


git clone https://github.com/yourusername/smart-compiler.git
cd smart-compiler
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn
🛠️ 2. Compile Secure Compiler
Ensure you have flex and bison installed:

bash
Copy code
sudo apt install flex bison
Then compile your C compiler:

bash
Copy code
bison -d parser.y
flex lexer.l
gcc parser.tab.c lex.yy.c -o secure_compiler
▶️ 3. Run FastAPI Server
bash
Copy code
uvicorn api:app --host 0.0.0.0 --port 8000
🔌 API Endpoints
POST /analyze-code
Send raw C code in JSON body:

json
Copy code
{
  "code": "#include <stdio.h>\nint main() { return 0; }"
}
Response:

json
Copy code
{
  "stdout": "...",
  "stderr": "..."
}
POST /analyze-file
Upload a .c file:

Form field: file

Content-Type: multipart/form-data

Response:

json
Copy code
{
  "stdout": "...",
  "stderr": "..."
}
🌐 Frontend (Optional)
You can build a simple React UI to:

Paste or upload C code

Send it to the FastAPI backend

View analysis results in the browser

React can be built via:


Copy code
npm run build
And served via:

Static file host

FastAPI (app.mount("/frontend", ...))

Nginx (production)

🛡️ Security Considerations
This project executes user-submitted code, so it must be sandboxed before public deployment:

Use Docker to isolate execution

Add input validation and timeout

Never expose directly to internet without hardening

📄 License
This project is for educational and research purposes. Use responsibly.

👨‍💻 Author
Akarsh Saklani
GitHub: @Akarsh-2004
Feel free to fork, contribute, or reach out with improvements!
