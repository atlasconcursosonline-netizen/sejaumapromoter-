import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, LayoutDashboard, Settings, LogOut, Star, Film } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/master' },
    { icon: Users, label: 'Promotores', path: '/master/promotores' },
    { icon: Star, label: 'Eventos', path: '/master/eventos' },
    { icon: Film, label: 'Media Assets', path: '/master/midia' },
    { icon: Settings, label: 'Configurações', path: '/master/config' },
  ];

  return (
    <aside className="w-64 bg-black border-r border-amber-500/10 h-screen fixed left-0 top-0 z-40 hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg premium-gradient flex items-center justify-center font-black text-black text-xs shadow-lg shadow-amber-500/20">
            AP
          </div>
          <span className="font-display font-black text-white tracking-widest uppercase text-xs">
            Acelera Produções
          </span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/master'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'premium-gradient text-black shadow-lg shadow-amber-500/20'
                    : 'text-zinc-500 hover:bg-white/5 hover:text-amber-500'
                }`
              }
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-amber-500/10">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-500 transition-all w-full text-left group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Sair</span>
        </button>
      </div>
    </aside>
  );
}
