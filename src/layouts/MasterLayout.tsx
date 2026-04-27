import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export function MasterLayout() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 md:p-10 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
