import React from 'react';
import { RecruiterHeader } from './RecruiterHeader';
import { RecruiterSidebar } from './RecruiterSidebar';

interface RecruiterLayoutProps {
  children: React.ReactNode;
}

export function RecruiterLayout({ children }: RecruiterLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Header */}
      <RecruiterHeader />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <RecruiterSidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}