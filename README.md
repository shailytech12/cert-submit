# CertifyPro - Certificate Verification System

A comprehensive web application for certificate verification with separate student and admin panels built with React, TypeScript, Firebase, and Tailwind CSS.

## Features

### Student Panel
- **User Registration & Authentication** - Students can create accounts and login securely
- **Certificate Submission** - Upload certificates with detailed information (name, type, institution, dates, grades)
- **Real-time Status Tracking** - Monitor verification status (pending, approved, rejected)
- **Dashboard Statistics** - View total, approved, pending, and rejected certificates
- **Certificate Management** - View submitted certificates with admin comments
- **File Support** - Upload PDF, JPG, PNG certificate files

### Admin Panel
- **Admin Authentication** - Separate admin login and registration
- **Certificate Review** - View all submitted certificates with filtering options
- **Verification Tools** - Approve or reject certificates with comments
- **Detailed Certificate View** - Modal with full certificate information and file preview
- **Status Management** - Update certificate status with timestamping
- **Dashboard Analytics** - Comprehensive statistics and filtering

### General Features
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Clean, professional interface using Tailwind CSS
- **Real-time Updates** - Instant status updates using Firebase
- **Secure File Storage** - Firebase Storage for certificate files
- **Role-based Access** - Separate interfaces for students and admins

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **UI Components**: Custom components with Radix UI primitives
- **Build Tool**: Vite
- **State Management**: React hooks and context
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Notifications**: Sonner
- **Routing**: React Router DOM

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Firebase account

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd certificate-verification-system
npm install
```

### 2. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Enable Firebase Storage
5. Get your Firebase configuration from Project Settings > Web apps

### 3. Environment Configuration
1. Copy `.env.example` to `.env`
2. Replace the placeholder values with your Firebase configuration:
```bash
cp .env.example .env
```

Update `.env` with your Firebase config:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Students can read/write their own certificates
    // Admins can read/write all certificates
    match /certificates/{certificateId} {
      allow read, write: if request.auth != null && 
        (resource.data.studentId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && request.auth.uid == request.resource.data.studentId;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /certificates/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

### 5. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage Guide

### Getting Started
1. Visit the application homepage
2. Choose to register as either a Student or Administrator
3. Complete the registration form
4. Login with your credentials

### For Students
1. **Submit Certificate**: Click "Submit New Certificate" and fill out the form
2. **Track Status**: View your certificate status on the dashboard
3. **View Details**: Click on any certificate card to see full details
4. **Download**: Access your original certificate files anytime

### For Administrators
1. **Review Queue**: View all pending certificates requiring review
2. **Filter Certificates**: Use status filters to organize the queue
3. **Verify Certificates**: Click "View Details" to see full information
4. **Approve/Reject**: Make verification decisions with optional comments
5. **Track Performance**: Monitor verification statistics

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── forms/             # Form components
│   ├── student/           # Student-specific components
│   └── admin/             # Admin-specific components
├── context/               # React contexts
├── hooks/                 # Custom hooks
├── lib/                   # Utility libraries
├── pages/                 # Page components
├── types/                 # TypeScript type definitions
└── App.tsx               # Main application component
```

## Database Schema

### Users Collection
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  createdAt: Timestamp;
  avatar?: string;
}
```

### Certificates Collection
```typescript
{
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  certificateName: string;
  certificateType: string;
  institution: string;
  issueDate: Timestamp;
  expiryDate?: Timestamp;
  grade?: string;
  fileUrl: string;
  fileName: string;
  status: 'pending' | 'approved' | 'rejected';
  adminComments?: string;
  verifiedBy?: string;
  verifiedAt?: Timestamp;
  submittedAt: Timestamp;
}
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Building for Production
```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Deploy to Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

## Security Considerations

- All authentication is handled by Firebase Auth
- Database access is controlled by Firestore security rules
- File uploads are secured through Firebase Storage rules
- Environment variables are used for sensitive configuration
- Input validation on both client and server side

## Support

For issues and feature requests, please create an issue in the repository.

## License

This project is licensed under the MIT License.