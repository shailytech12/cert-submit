import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/ui/LoadingSpinner';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import DemoPage from './pages/DemoPage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import OpportunitiesPosted from './pages/recruiter/OpportunitiesPosted';
import Applications from './pages/recruiter/Applications';
import Candidates from './pages/recruiter/Candidates';
import Grievances from './pages/recruiter/Grievances';
import Profile from './pages/recruiter/Profile';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      
      {/* Main Dashboard Route */}
      <Route 
        path="/dashboard" 
        element={
          user ? (
            user.role === 'admin' ? <AdminDashboard /> : 
            user.role === 'recruiter' ? <Navigate to="/recruiter/dashboard" /> :
            <StudentDashboard />
          ) : (
            <Navigate to="/login" />
          )
        } 
      />

      {/* Recruiter Routes */}
      <Route 
        path="/recruiter/dashboard" 
        element={
          user && user.role === 'recruiter' ? <RecruiterDashboard /> : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/recruiter/opportunities" 
        element={
          user && user.role === 'recruiter' ? <OpportunitiesPosted /> : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/recruiter/applications" 
        element={
          user && user.role === 'recruiter' ? <Applications /> : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/recruiter/candidates" 
        element={
          user && user.role === 'recruiter' ? <Candidates /> : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/recruiter/grievances" 
        element={
          user && user.role === 'recruiter' ? <Grievances /> : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/recruiter/profile" 
        element={
          user && user.role === 'recruiter' ? <Profile /> : <Navigate to="/login" />
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;