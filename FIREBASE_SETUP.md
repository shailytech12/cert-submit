# 🔥 Firebase Setup Guide for CertifyPro

## 📋 Prerequisites
- Google account
- Node.js and npm installed
- Basic understanding of Firebase services

---

## 🚀 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `certifypro` (or your preferred name)
4. Choose whether to enable Google Analytics (recommended)
5. Click **"Create project"**

### 1.2 Project Configuration
1. Wait for project creation (usually 1-2 minutes)
2. Click **"Continue"** when ready
3. You'll be redirected to the project dashboard

---

## 🔐 Step 2: Enable Authentication

### 2.1 Navigate to Authentication
1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**

### 2.2 Configure Sign-in Methods
1. Go to the **"Sign-in method"** tab
2. Click on **"Email/Password"**
3. Toggle **"Enable"** for Email/Password
4. Optionally enable **"Email link (passwordless sign-in)"**
5. Click **"Save"**

### 2.3 Configure Authorized Domains (Optional)
1. In the **"Sign-in method"** tab, scroll to **"Authorized domains"**
2. Add your domain if deploying to production
3. `localhost` is already authorized for development

---

## 🗄️ Step 3: Setup Firestore Database

### 3.1 Create Database
1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll configure rules later)
4. Select your preferred location (choose closest to your users)
5. Click **"Done"**

### 3.2 Configure Security Rules
1. Go to the **"Rules"** tab in Firestore
2. Replace the default rules with:

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

3. Click **"Publish"**

---

## 📁 Step 4: Enable Firebase Storage

### 4.1 Create Storage Bucket
1. In the left sidebar, click **"Storage"**
2. Click **"Get started"**
3. Review security rules (we'll update them)
4. Click **"Next"**
5. Choose storage location (same as Firestore)
6. Click **"Done"**

### 4.2 Configure Storage Rules
1. Go to the **"Rules"** tab in Storage
2. Replace the default rules with:

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

3. Click **"Publish"**

---

## ⚙️ Step 5: Get Firebase Configuration

### 5.1 Register Web App
1. In the project overview, click the **"Web"** icon (`</>`)
2. Enter app nickname: `CertifyPro Web`
3. **Don't** check "Also set up Firebase Hosting" (optional)
4. Click **"Register app"**

### 5.2 Copy Configuration
1. Copy the Firebase configuration object
2. It should look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 5.3 Update Environment Variables
1. Open your `.env` file in the project root
2. Replace the demo values with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSyB...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

---

## 🧪 Step 6: Test the Setup

### 6.1 Start Development Server
```bash
npm run dev
```

### 6.2 Test Registration
1. Open the application in your browser
2. Click **"Register"**
3. Create a test student account
4. Verify you can login successfully

### 6.3 Test Admin Account
1. Register a second account as **"Administrator"**
2. Login and verify you see the admin dashboard
3. Test the different interfaces

---

## 🔧 Step 7: Advanced Configuration (Optional)

### 7.1 Email Templates
1. In Authentication, go to **"Templates"**
2. Customize email verification templates
3. Set your app name and contact email

### 7.2 User Management
1. Go to **"Users"** tab in Authentication
2. You can manually manage users here
3. View user creation dates and last sign-in

### 7.3 Usage Monitoring
1. Check **"Usage"** tab in each service
2. Monitor reads, writes, and storage usage
3. Set up billing alerts if needed

---

## 🚨 Security Best Practices

### 7.1 API Key Security
- **Never** commit real API keys to public repositories
- Use environment variables for all configurations
- Rotate API keys if compromised

### 7.2 Database Security
- Regularly review Firestore rules
- Test rules with the Firebase simulator
- Monitor unusual access patterns

### 7.3 Storage Security
- Implement file size limits
- Validate file types on upload
- Regularly audit stored files

---

## 📊 Step 8: Monitoring & Analytics

### 8.1 Enable Analytics (Recommended)
1. Go to **"Analytics"** in the sidebar
2. Review user engagement data
3. Set up conversion tracking

### 8.2 Performance Monitoring
1. In **"Performance"**, click **"Get started"**
2. Follow the setup instructions
3. Monitor page load times and user flows

### 8.3 Crashlytics (Optional)
1. Enable crashlytics for error tracking
2. Monitor application stability
3. Get detailed error reports

---

## 🚀 Step 9: Production Deployment

### 9.1 Firebase Hosting (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### 9.2 Custom Domain (Optional)
1. In **"Hosting"**, go to **"Custom domain"**
2. Follow the domain verification process
3. Configure DNS settings

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] Authentication works for both roles
- [ ] Certificate submission functions properly
- [ ] File uploads work correctly
- [ ] Admin verification system operates
- [ ] Email notifications are sent (if enabled)
- [ ] Security rules are properly configured
- [ ] Environment variables are set correctly
- [ ] Application builds without errors
- [ ] All features are tested on mobile devices

---

## 🆘 Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check API key in environment variables
   - Ensure no extra spaces or quotes

2. **"Missing or insufficient permissions"**
   - Review Firestore security rules
   - Check user authentication status

3. **"Storage upload failed"**
   - Verify Storage rules configuration
   - Check file size and type restrictions

4. **"Module not found" errors**
   - Run `npm install --legacy-peer-deps`
   - Clear node_modules and reinstall

### Getting Help:
- Firebase Documentation: https://firebase.google.com/docs
- Stack Overflow: Tag your questions with `firebase`
- Firebase Support: Available in Firebase Console

---

## 🎉 Congratulations!

Your Firebase setup is now complete! The CertifyPro application should be fully functional with:

- ✅ User authentication and registration
- ✅ Real-time database operations
- ✅ Secure file storage and retrieval
- ✅ Role-based access control
- ✅ Production-ready security rules

**Your certificate verification system is ready for use!**