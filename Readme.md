# CodeFlow

CodeFlow is a real-time, AI-powered collaborative code editor designed to streamline development workflows. Write, debug, and build projects seamlessly, whether you're working solo or with a team across the globe.

## Features

- **Real-time Collaboration**: Code together with multiple participants in a shared room, with changes synced instantly via WebSockets.
- **AI Assistant**: Integrated AI chat powered by Google Gemini to help debug, explain concepts, or generate code snippets.
- **Multi-language Support**: A versatile editor supporting a wide range of popular programming languages including JavaScript, Python, C++, Java, TypeScript, and more.
- **In-browser Code Execution**: Run your code directly in the browser and see the output, powered by the Judge0 API.
- **Live HTML/CSS/JS Preview**: Get instant visual feedback for web development with a live-rendering preview pane.
- **Secure User Authentication**: JWT-based authentication system for user sign-up, sign-in, and session management.
- **Collaborative Rooms**: Easily create new coding rooms or join existing ones with a unique Room ID.
- **Code Export**: Save your work by exporting your code files directly from the editor.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn/ui, Monaco Editor, React Query, Zustand, Socket.io-client, GSAP
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, Socket.io, JSON Web Tokens (JWT)
- **APIs**: Google Gemini, Judge0

## Project Structure

This project is a monorepo containing two main packages:

- `/frontend`: The client-side application built with React and Vite.
- `/backend`: The server-side application built with Node.js and Express.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/itsshivamnith/syntaxHive.git
    cd syntaxHive
    ```

2.  **Set up the Backend:**
    - Navigate to the backend directory:
      ```sh
      cd backend
      ```
    - Install dependencies:
      ```sh
      npm install
      ```
    - Create a `.env` file in the `backend` directory and add the following environment variables:
      ```env
      PORT=8000
      DATABASE_URL=<your_mongodb_connection_string>
      FRONTEND_URL=http://localhost:5173
      JWT_SECRET=<your_secure_jwt_secret>
      GEMINI_API_KEY=<your_google_gemini_api_key>
      ```
    - Start the backend server:
      ```sh
      npm run dev
      ```

3.  **Set up the Frontend:**
    - Navigate to the frontend directory from the root folder:
      ```sh
      cd frontend
      ```
    - Install dependencies:
      ```sh
      npm install
      ```
    - Create a `.env` file in the `frontend` directory and add the following environment variables. You'll need an API key from [RapidAPI (Judge0 CE)](https://rapidapi.com/judge0-official/api/judge0-ce).
      ```env
      VITE_BASE_URL=http://localhost:8000
      VITE_EXECUTION_API_KEY=<your_judge0_api_key>
      ```
    - Start the frontend development server:
      ```sh
      npm run dev
      ```

Your application should now be running, with the frontend available at `http://localhost:5173` and the backend at `http://localhost:8000`.