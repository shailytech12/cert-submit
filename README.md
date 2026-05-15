# Certificate Submission & Tracking System

A full-stack MERN application designed to manage certificate submissions efficiently through a role-based dashboard system. The platform enables students to upload and track certificates while allowing administrators to review submissions, update statuses, and provide structured feedback.

Live Application:
[https://cert-submit.vercel.app](https://cert-submit.vercel.app)

---

## Project Overview

The Certificate Submission & Tracking System streamlines academic certificate management within institutions. It provides a structured workflow for submission, review, and tracking of certificates.

The system ensures:

* Organized certificate management
* Role-based access control
* Secure file handling
* Real-time status updates
* Centralized administrative monitoring

---

## Key Features

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

---

## Potential Use Cases

* Colleges and Universities
* Academic Departments
* Internship Tracking Systems
* Certification Programs
* Training Institutions

---

## Future Enhancements

* Email notifications for status updates
* Advanced analytics dashboard
* Cloud-based file storage integration
* Blockchain-based certificate verification
* Downloadable submission reports

If you would like, I can also provide a concise 3–4 line version tailored specifically for your resume or portfolio.
