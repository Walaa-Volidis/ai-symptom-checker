# 🧠 AI-Powered Symptom Analyzer (Groq Edition)

An intelligent and bilingual web application that allows users to describe their symptoms and receive an **AI-generated health analysis** using the **Groq API**.  
The app includes voice input, text-to-speech output, dark/light themes, and supports both Arabic and English for an accessible experience.

---

## ✨ Features

- 🩺 **AI Symptom Analysis (via Groq API):** Enter or speak your symptoms, and the system provides possible medical explanations using Groq’s high-performance LLM.
- 🎙️ **Voice Input:** Use your microphone to describe symptoms hands-free.
- 🔊 **Text-to-Speech Output:** Hear your results spoken aloud using the browser’s SpeechSynthesis API.
- 🌓 **Dark/Light Themes:** Switch between light and dark modes to suit your environment.
- 🌐 **Bilingual Interface (English & Arabic):** Toggle easily between English and Arabic.

---

## 🧩 Technologies Used

| Technology | Purpose |
|-------------|----------|
| **Next.js** | React framework for building fast, server-rendered web applications |
| **TypeScript** | Provides strong typing and reliable development experience |
| **Tailwind CSS** | Utility-first CSS framework for responsive UI |
| **Lucide React** | Clean, lightweight icons |
| **Groq API** | Powers the AI symptom reasoning |
| **SpeechRecognition API** | Handles voice input |
| **SpeechSynthesis API** | Enables text-to-speech responses |

---

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### ✅ Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm**

Install the latest npm version if needed:
npm install npm@latest -g

---

## 🚀 Installation

Clone the repository:  
git clone https://github.com/Walaa-Volidis/ai-symptom-checker.git  
cd ai-symptom-checker  

Install dependencies:  
npm install  

Configure environment variables by creating a `.env.local` file in the project root and adding your **Groq API key**:  
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here  

Run the application:  
npm run dev  

Now open your browser at:  
http://localhost:3000

---

## 💡 Usage

Type or speak your symptoms.  
Click “Analyze Symptoms”.  
The AI model (via Groq API) suggests possible medical conditions.  
Use the 🔊 button to listen to results.  
Switch between 🌙 Dark / ☀️ Light modes.  
Change the interface language between 🇬🇧 English and 🇸🇦 Arabic.

---

## 🧱 Project Structure

ai-symptom-checker/  
│  
├── pages/               # Next.js pages (routing system)  
├── components/          # Reusable UI components  
├── hooks/               # Custom React hooks (voice, theme, etc.)  
├── public/              # Static assets (icons, images)  
├── styles/              # Global and Tailwind styles  
├── .env.local           # Environment variables (Groq API key)  
├── Dockerfile           # Docker image configuration  
├── compose.yaml         # Docker Compose setup  
├── deployment.yaml      # Kubernetes Deployment configuration  
├── service.yaml         # Kubernetes Service configuration  
└── .github/workflows/   # GitHub Actions (CI/CD pipeline)

---

## 🐳 Deployment

### Docker

Build the Docker image:  
docker build -t ai-symptom-analyzer .  

Run the container locally:  
docker run -p 3000:3000 ai-symptom-analyzer  

Or use Docker Compose:  
docker compose up  

### Kubernetes

To deploy on a Kubernetes cluster:  
kubectl apply -f deployment.yaml -f service.yaml

---

## ⚡ CI/CD Pipeline

This project includes a **GitHub Actions** workflow (`.github/workflows/main.yml`) that automates:  
✅ Building and testing on every push  
🐳 Building and pushing Docker images  
🚀 Deploying automatically to Kubernetes clusters  
