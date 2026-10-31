<img width="1782" height="460" alt="image" src="https://github.com/user-attachments/assets/ab923d5f-90f4-4539-a753-386a34105b50" />

# CoreATS

CoreATS is a AI-powered Applicant Tracking System (ATS) optimization tool. It is designed to help users evaluate and improve their resumes through semantic analysis, structural audits, and actionable optimization strategies. 

The application utilizes a privacy-first architecture, ensuring that all uploaded documents are processed securely in volatile memory and never persisted to a hard drive.

## Core Features

*   **Matchmaker Engine:** Compares a candidate's CV against a target job description to generate a semantic alignment score. It identifies missing critical keywords and provides a tailored optimization strategy.
*   **General ATS Audit:** Evaluates the structural health of a CV independently of a job description. It detects missing standard sections (e.g., Education, Experience), identifies formatting issues that could break an ATS parser, and suggests strong replacements for weak action verbs.
*   **Privacy-First Processing:** Implements memory-buffer processing via Multer. Documents are parsed and immediately discarded post-analysis, ensuring complete user data privacy.
*   **Modern Asynchronous UI:** Features a responsive React interface with real-time skeleton loading states, state-driven mode switching, and organized metric dashboards.

## Technology Stack

*   **Frontend:** React, Vite, Axios, Lucide-React
*   **Backend:** Node.js, Express.js
*   **AI Integration:** Google Gen AI SDK (Gemini Flash)
*   **Document Parsing:** PDF-Parse, Multer (Memory Storage)

## Prerequisites
*   **Node.js** (v18.0.0 or higher)
*   **npm** (v9.0.0 or higher)
*   **A valid Google Gemini API Key** (Generated via Google AI Studio)

## Installation & Setup
1. Backend Setup
*   Navigate to the backend directory, install dependencies, and configure the environment variables:
```bash
cd ATSCore/backend
npm install
```

* Create a .env file in the backend directory with the following variables:
```bash
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
```

* Start the backend development server:
```bash
npm run dev
```

2. Frontend Setup
* Open a new terminal session, navigate to the frontend directory, and install dependencies:
```bash
cd ATSCore/frontend
npm install
```

* Start the frontend development server:
```bash
npm run dev
```

## Usage
* Open the local development URL (typically http://localhost:5173) in your web browser.

* Select the desired analysis mode via the top navigation tabs:

* **Matchmaker:** Paste a target job description and upload a PDF or Word format CV. Click "Scan Resume Match" to receive semantic alignment metrics.

* **General Audit:** Upload a CV directly to check for formatting errors and weak action verbs.

* Review the AI-generated dashboard containing the health score, missing keywords, and structural recommendations.

## Future Roadmap
* **Blueprint Generation:** Implement an AI mode capable of generating custom, highly optimized CV templates based strictly on a provided job description.
