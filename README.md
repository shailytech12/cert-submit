# Welcome to your project
# Certificate Submission & Tracking System

## How can I edit this code?
A full-stack MERN application designed to manage certificate submissions efficiently through a role-based dashboard system. The platform enables students to upload and track certificates while allowing administrators to review submissions, update statuses, and provide structured feedback.

There are several ways of editing your application.
Live Application:
[https://cert-submit.vercel.app](https://cert-submit.vercel.app)

**Use your preferred IDE**
---

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.
## Project Overview

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
The Certificate Submission & Tracking System streamlines academic certificate management within institutions. It provides a structured workflow for submission, review, and tracking of certificates.

Follow these steps:
The system ensures:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>
* Organized certificate management
* Role-based access control
* Secure file handling
* Real-time status updates
* Centralized administrative monitoring

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>
---

# Step 3: Install the necessary dependencies.
npm i
## Key Features

# Step 4: Start the development server with auto-reloading and an instant preview.
### Student Module

* Secure authentication
* Upload certificates (PDF, JPG, PNG, etc.)
* View submitted certificates
* Track status (Pending, In Progress, Completed)
* Receive feedback from administrators
* Delete submissions when required

### Admin Module

* View all student submissions
* Update certificate status
* Provide feedback
* Monitor submissions through a centralized dashboard

---

## Technology Stack

### Frontend

* React.js
* JavaScript (ES6+)
* HTML5
* CSS3
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer (File upload handling middleware)

### Deployment

* Frontend deployed on Vercel
* Backend hosted on Node.js server
* MongoDB Atlas (Cloud database)

---

## System Architecture

Client (React)
→ REST API (Node.js + Express)
→ MongoDB Database

File Upload Flow:

User → Multer Middleware → Server → MongoDB → Frontend Display


## Installation and Setup (Local Development)

### 1. Clone the Repository

```
git clone https://github.com/Yuva-Deekshitha-N/<your-repository-name>.git
cd <your-repository-name>
```

### 2. Install Dependencies

Frontend:

```
cd client
npm install
```

Backend:

```
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 4. Run the Application

Start Backend:

```
npm start
```

Start Frontend:

```
npm run dev
```

**Edit a file directly in GitHub**
Access the application at:

```
http://localhost:3000
```

---

## Role-Based Access Control

| Role    | Capabilities                            |
| ------- | --------------------------------------- |
| Student | Upload, View, Track Certificates        |
| Admin   | Review, Update Status, Provide Feedback |

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.
---

**Use GitHub Codespaces**
## Potential Use Cases

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.
* Colleges and Universities
* Academic Departments
* Internship Tracking Systems
* Certification Programs
* Training Institutions

## What technologies are used for this project?
---

This project is built with:
## Future Enhancements

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
* Email notifications for status updates
* Advanced analytics dashboard
* Cloud-based file storage integration
* Blockchain-based certificate verification
* Downloadable submission reports

If you would like, I can also provide a concise 3–4 line version tailored specifically for your resume or portfolio.
