import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export function MasterLayout() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
