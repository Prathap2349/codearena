# ⚔️ CodeArena - AI-Powered Coding Judge

A browser-based competitive coding platform where you can write, run, and evaluate code against hidden test cases — powered by AI.

## ✨ Features

- 💻 Full in-browser **Monaco Editor** (same as VS Code)
- 🤖 **AI-powered test case generation** using Google Gemini
- ⚡ **Real-time code execution** via Judge0 API
- 🧪 Hidden test cases with pass/fail results
- 📝 Custom problem creation (title, description, sample I/O)
- 🕐 Execution history tracking
- 🔐 Login screen with session management
- 🌙 Dark themed UI built with React + Tailwind CSS

## 🚀 Live Demo

[View Live](https://codearena-roan.vercel.app)

## 🔧 Installation

```bash
# Clone the repo
git clone https://github.com/Prathap2349/codearena.git

# Install dependencies
cd codearena
npm install

# Start dev server
npm run dev
```

## ⚙️ Setup

You need two API keys:

1. **Gemini API Key** — for AI test case generation
   - Get it at [aistudio.google.com](https://aistudio.google.com)

2. **Judge0 API Key** — for code execution
   - Get it at [rapidapi.com/judge0](https://rapidapi.com/judge0-official/api/judge0-ce)

Add them in the **Settings** panel inside the app.

## 🎮 How to Use

1. Open the app and log in
2. Enter a problem title and description
3. Add sample input and expected output
4. Click **Auto-Generate with AI** to create hidden test cases
5. Write your solution in the editor
6. Click **Run** to execute and see results
7. Check pass/fail for each hidden test case

## 🛠️ Built With

- React 19
- Vite
- Tailwind CSS
- Monaco Editor
- Google Gemini AI
- Judge0 API
- Lucide Icons

## 👨‍💻 Author

Made by [Prathap](https://github.com/Prathap2349)

## 📄 License

MIT License
