# Maths-VLab

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node-%3E%3D12-blue.svg)](https://nodejs.org/)

Maths-VLab is a dynamic, interactive ed-tech platform designed to revolutionize mathematics learning. Built with the MERN stack, Maths-VLab offers a comprehensive environment where students can explore interactive simulations, watch video lectures, take quizzes, track progress, and even play educational games. Instructors can also showcase their expertise and manage courses seamlessly.

## Table of Contents

- [Project Description](#project-description)
- [System Architecture](#system-architecture)
- [Frontend](#frontend)
- [Backend](#backend)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [Deployment](#deployment)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Screenshots](#screenshots)

## Project Description

Maths-VLab is a fully functional ed-tech platform that enables users to create, consume, and rate educational content. The platform is built using the MERN stack (MongoDB, ExpressJS, ReactJS, NodeJS), and it provides:
- **A seamless and interactive learning experience:** Students can access interactive simulations, video lectures, quizzes, and progress tracking.
- **A platform for instructors:** Instructors can create courses, manage content, and connect with learners globally.
- **Robust backend & API design:** Ensures secure authentication, efficient content management, and scalability.
- **SEO-friendly deployment:** Dynamic sitemap generation and RESTful API design for improved search engine indexing.

---

## System Architecture

Maths-VLab follows a client-server architecture comprising three main components:

- **Frontend:**  
  Built with ReactJS, it uses dynamic, lazy-loaded components to display various types of study content (text, video, simulation, quiz, progress, games). The state management (using Redux or Context API) ensures a responsive, user-friendly interface.
  
- **Backend:**  
  Implemented with NodeJS and ExpressJS, the backend provides RESTful APIs for authentication, content management, course management, and user progress tracking. JWT-based authentication with token refresh, and middleware for secure API access are key features.
  
- **Database:**  
  MongoDB is used as the primary data store with a flexible schema design. Data is organized in multiple collections with references:
  - **Topics**: Contains metadata and references to content.
  - **TextContent, VideoContent, SimulationContent, Quiz, GameContent**: Separate collections for each content type.
  - **Progress**: Tracks user progress across topics.

---

## Frontend

The client-side is built using ReactJS and leverages modern features such as lazy loading and Suspense to ensure that only the necessary components are loaded on demand. Key pages include:

- **Homepage:** An introduction to Maths-VLab with navigation to course lists and featured content.
- **Study Page:** A dynamic tab interface that loads text, video, simulation, quiz, progress, and game content on demand.
- **User & Instructor Dashboards:** Customized views for students and instructors.
- **Authentication Pages:** Sign In, Sign Up, and password reset functionalities.

### Technologies
- ReactJS, Vite (or Create React App)
- Axios for API calls
- CSS / Tailwind CSS for styling
- Redux or Context API for state management

---

## Backend

The backend is built using NodeJS, ExpressJS, and MongoDB. It includes:

- **Authentication:**  
  Secure user authentication with JWT, refresh tokens, and password reset functionality.
  
- **Content Management:**  
  APIs for creating, updating, and retrieving topics and related content (text, video, simulation, quiz, game).
  
- **User Management:**  
  Endpoints for user profiles, authentication status, and progress tracking.

### Technologies
- NodeJS, ExpressJS
- MongoDB, Mongoose
- JWT, bcryptjs
- Nodemailer for email notifications
- Additional middleware: cors, cookie-parser

---

## Database Schema

Maths-VLab uses a modular schema design with multiple collections that reference each other:

- **Topic:**  
  Stores domain, topicId, title, description, and references to content (text, video, simulation, quiz, game).

- **TextContent:**  
  Contains text-based study material.

- **VideoContent:**  
  Stores video URL, thumbnail, duration, and description.

- **SimulationContent:**  
  Contains an embed URL and description for interactive simulations.

- **Quiz:**  
  Stores quiz questions, options, correct answers, explanations, and score information.

- **GameContent:**  
  Contains game URL and description.

- **Progress:**  
  Tracks user progress, including completed sections and quiz scores.

---

## API Design

The RESTful API is designed to ensure efficient communication between the frontend and backend. Key endpoints include:

### **Authentication**
- `POST /api/auth/signup` – Register a new user.
- `POST /api/auth/login` – Log in and generate JWT tokens.
- `POST /api/auth/forgot-password` – Send password reset link.
- `POST /api/reset-password` – Reset password.

### **Topics and Content**
- `GET /api/topics/:topicId` – Retrieve a topic and its content references.
- `GET /api/textContent/:id` – Retrieve text content.
- `GET /api/videoContent/:id` – Retrieve video content.
- `GET /api/simulationContent/:id` – Retrieve simulation content.
- `GET /api/quiz/:id` – Retrieve quiz data.
- `GET /api/gameContent/:id` – Retrieve game content.

### **User Progress**
- `GET /api/progress/:userId` – Retrieve user progress data.
- `POST /api/progress/:userId/:topicId` – Create/update progress record.

---

## Deployment

The deployment process involves:
- **Building the Frontend:**  
  Use Vite (or Create React App) to build the production version.
- **Deploying the Backend:**  
  Host the Express server on a cloud provider (e.g., Heroku, AWS, DigitalOcean).
- **Database Hosting:**  
  Use MongoDB Atlas for a managed cloud database solution.
- **Environment Configuration:**  
  Use environment variables for sensitive information and configuration.
- **Sitemap & SEO:**  
  Generate a sitemap dynamically and configure robots.txt to enhance SEO.

---

## Testing

The platform is tested using:
- **Unit Testing:** Jest and React Testing Library for frontend components.
- **Integration Testing:** Supertest and Mocha/Chai for backend endpoints.
- **End-to-End Testing:** Cypress for simulating user interactions.

---

## Future Enhancements

Planned future enhancements include:
- **Enhanced Analytics:** More detailed insights for instructors and admin.
- **Real-Time Collaboration:** Integrate WebSockets for live discussions and collaborative problem-solving.
- **Advanced User Personalization:** Machine learning-based recommendations for courses.
- **Mobile App:** Develop a mobile version for a seamless learning experience.
- **Additional Content Types:** Expand content to include interactive assignments, AR/VR experiences, etc.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. For major changes, please open an issue to discuss your proposed improvements first.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Screenshots

_Add your screenshots below to showcase the UI:_

- **Homepage:**  
  ![Homepage Screenshot](path/to/homepage.png)

- **Study Page (Dynamic Tabs):**  
  ![Study Page Screenshot](path/to/studypage.png)

- **Course Details:**  
  ![Course Details Screenshot](path/to/coursedetails.png)

---

In summary, Maths-VLab is a comprehensive ed-tech platform built on the MERN stack. This README provides an overview of the system architecture, features, API design, deployment, testing, and future enhancements. Feel free to adjust this document as your project evolves.

---

Happy Coding! 🚀
