# Maths-VLab

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D12-blue.svg)](https://nodejs.org/)

Maths-VLab is a dynamic, interactive virtual learning platform designed for mathematics education. Built on the MERN stack, it provides a rich learning environment with interactive simulations, video lectures, quizzes, and progress tracking. The project is designed to deliver content on demand via dynamic tabs, ensuring optimal performance and an engaging user experience.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Overview

Maths-VLab provides an interactive virtual laboratory for students to explore mathematical concepts. The platform uses a dynamic tab system on the frontend to load different types of study content (theory, video, simulation, quiz, progress, games) on demand. The backend is structured with multiple collections in MongoDB that are linked via references, ensuring modular data management and easy scalability.

## Features

- **Dynamic Tab Management:** Load specific study content (theory, video, simulation, quiz, progress, games) on demand.
- **On-Demand Data Fetching:** Each tab fetches its data from the backend when activated.
- **Multiple Collections with References:** The backend uses separate collections for topics, text content, video content, simulation content, quizzes, and user progress.
- **Token-Based Authentication:** Secure routes using JWTs with automatic token refresh.
- **Password Reset Functionality:** Secure password reset via email.
- **Sitemap Generation:** Dynamic sitemap generation for improved SEO.
- **Responsive UI:** Built with React and modern CSS, ensuring an optimal experience across devices.

## Tech Stack

- **Frontend:**  
  - React (with lazy loading and Suspense)  
  - Vite (or Create React App)  
  - Tailwind CSS (optional) / Custom CSS  
  - Axios for API calls

- **Backend:**  
  - Node.js & Express  
  - MongoDB & Mongoose  
  - JSON Web Tokens (JWT) for authentication  
  - Nodemailer for sending emails  
  - Additional packages: cors, cookie-parser, bcryptjs, crypto

## Architecture

Maths-VLab follows a modular architecture:

- **Frontend:**  
  - **StudyPage.jsx**: Main container with dynamic tabs that lazy-loads content components.
  - **Content Components:** Separate components for text, video, simulation, quiz, progress, and games.
  - **Axios Instance:** Configured for API calls, token handling, and refresh logic.

- **Backend:**  
  - **Models:**  
    - `Topic.js` (contains references to content)  
    - `TextContent.js`, `VideoContent.js`, `SimulationContent.js`, `Quiz.js`, `GameContent.js`, `Progress.js`  
    - `Student.js` for user data  
  - **Routes:**  
    - Auth routes, user routes, token routes, contact routes  
    - **Content-specific routes:** `topicRoutes.js`, `textContentRoutes.js`, `videoContentRoutes.js`, `simulationRoutes.js`, `quizRoutes.js`, `progressRoutes.js`, `gameContentRoutes.js`
  - **Authentication:**  
    - Auth middleware to protect routes  
    - JWT token refresh logic in the Axios interceptor

## Installation

### Prerequisites

- Node.js (>= 12.x)
- npm or yarn
- MongoDB database (local or cloud)

### Setup

1. **Clone the repository:**

   ```bash
   git clone git@github.com:sujaldarji/Maths-VLab.git
   cd Maths-VLab
