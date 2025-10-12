# 🩺 AI Symptom Checker

[![Banner](./public/banner.png)](https://ai-symptom-checker.vercel.app/)

An intelligent, multilingual symptom checker powered by AI. Describe your symptoms in plain language and receive instant, detailed analysis, including potential conditions, severity levels, and self-care advice.

[**Live Demo**](https://ai-symptom-checker.vercel.app/)

---

## ✨ Features

-   **AI-Powered Analysis:** Leverages the Groq API with Llama 3.1 for fast and accurate symptom analysis.
-   **Multilingual Support:** Fully supports both **English** and **Arabic**, with a dynamic UI that adapts to Right-to-Left (RTL) layouts.
-   **Detailed Results:** Provides comprehensive analysis, including:
    -   Possible Condition
    -   Severity Level (Mild, Moderate, Severe)
    -   Detailed Summary
    -   Identified Symptoms
    -   Personalized Self-Care Tips
    -   Recommended Specialist
    -   Actionable Next Steps
-   **Sleek, Modern UI:** Built with Next.js, Tailwind CSS, and Radix UI for a responsive and intuitive user experience.
-   **Dark Mode:** Includes a theme toggle for comfortable use in all lighting conditions.
-   **Voice Input:** Supports voice-to-text for hands-free symptom description (in supported browsers).

---

## 📸 Screenshots

| Light Mode                               | Dark Mode                                |
| ---------------------------------------- | ---------------------------------------- |
| ![Light Mode](./public/screenshot-1.png) | ![Dark Mode](./public/screenshot-2.png)   |

---

## 🛠️ Technologies Used

-   **Frontend:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **AI:** [Groq API](https://groq.com/), [Llama 3.1](https://llama.meta.com/llama3/)
-   **UI Components:** [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
-   **State Management:** React Hooks & Context API
-   **Schema Validation:** [Zod](https://zod.dev/)
-   **Deployment:** [Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/), [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v20.x or later)
-   [npm](https://www.npmjs.com/)
-   [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/ai-code-explainer.git
    cd ai-code-explainer
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add your Groq API key:

    ```env
    GROQ_API_KEY="your_groq_api_key"
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## ⚙️ Environment Variables

-   `GROQ_API_KEY`: Your API key for the Groq service.

---

## 🐳 Deployment

This project includes `Dockerfile`, `compose.yaml`, `deployment.yaml`, and `service.yaml` for easy containerization and deployment with Docker and Kubernetes.

### Docker

To build and run the Docker container:

```bash
# Build the image
docker build -t ai-symptom-checker .

# Run the container
docker run -p 3000:3000 -e GROQ_API_KEY=$GROQ_API_KEY ai-symptom-checker
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
