# QR Frontend

A basic React frontend with Google Authentication integration, built using Vite and Tailwind CSS.

## Features

- **Google Authentication**: Integrated with `http://localhost:5000/auth/google`.
- **Protected Routes**: Dashboard is only accessible after authentication.
- **Mobile Friendly**: Fully responsive design using Tailwind CSS 4.
- **Modern Tech Stack**: React 19, Vite, Tailwind CSS 4, Axios, and Lucide React.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (runs on port 3000):
   ```bash
   npm run dev
   ```


## API Configuration

The app expects an API running at `http://localhost:5000`.

- `GET /me`: Returns current user info or 401.
- `GET /auth/google`: Redirection endpoint for Google Login.

## Project Structure

- `src/api`: Axios instance configuration.
- `src/context`: Authentication context provider.
- `src/pages`: UI pages (Login, Dashboard).
- `src/App.jsx`: Main routing and provider setup.
- `src/index.css`: Tailwind CSS configuration.
# qrfrontend
