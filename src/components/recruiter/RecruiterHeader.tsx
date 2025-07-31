import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export function RecruiterHeader() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Home link */}
        <div className="flex items-center space-x-4">
          <Link 
            to="/recruiter/dashboard" 
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">
              {user?.displayName || user?.email}
            </span>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}