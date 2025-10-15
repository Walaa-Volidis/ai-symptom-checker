# AI-Powered Symptom Analyzer

This is a web application that allows users to input their symptoms and get an analysis of possible causes using AI.

## Features

*   **Symptom Analysis:** Users can enter their symptoms and get a list of possible medical conditions.
*   **Dark/Light Theme:** The application supports both dark and light themes for user comfort.
*   **Language Selection:** The application supports both English and Arabic languages.
*   **Text-to-Speech:** The application can read the analysis results out loud.
*   **Voice Input:** Users can input their symptoms using their voice.

## Technologies Used

*   **Next.js:** A React framework for building server-side rendered and static web applications.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom user interfaces.
*   **Lucide React:** A library of simply designed icons for React.
*   **Google Generative AI:** The AI model used for symptom analysis.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   npm
```sh
npm install npm@latest -g
```

### Installation

1.  Clone the repo
```sh
git clone https://github.com/your_username_/Project-Name.git
```
2.  Install NPM packages
```sh
npm install
```
3.  Create a `.env.local` file and add your Google Generative AI API key:
```sh
NEXT_PUBLIC_GOOGLE_API_KEY=YOUR_API_KEY
```

### Running the Application

```sh
npm run dev
```

## Usage

1.  Enter your symptoms in the text area or use the voice input button.
2.  Click the "Analyze Symptoms" button.
3.  The application will display a list of possible medical conditions based on your symptoms.
4.  You can toggle between dark and light themes using the theme toggle button.
5.  You can switch between English and Arabic languages using the language selector.
6.  You can use the text-to-speech feature to have the results read to you.

## Deployment

This application is containerized using Docker and can be deployed to a Kubernetes cluster.

### Docker

A `Dockerfile` is provided to build a Docker image of the application. You can build the image with the following command:

```sh
docker build -t symptom-analyzer .
```

A `compose.yaml` file is also provided for easy local deployment using Docker Compose.

### Kubernetes

The `deployment.yaml` and `service.yaml` files can be used to deploy the application to a Kubernetes cluster. You can apply these files with the following command:

```sh
kubectl apply -f deployment.yaml -f service.yaml
```

## CI/CD

This project is configured with a CI/CD pipeline using GitHub Actions. The pipeline is defined in the `.github/workflows/main.yml` file. The pipeline will automatically build and test the application on every push to the `main` branch. It will also build and push a Docker image to a container registry and deploy the application to a Kubernetes cluster.
