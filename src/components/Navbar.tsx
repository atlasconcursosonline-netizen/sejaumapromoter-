import React from 'react';
import { Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function Navbar() {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/master': return 'Dashboard Geral';
      case '/master/promotores': return 'Time de Promotores';
      case '/master/eventos': return 'Gestão de Eventos';
      case '/master/config': return 'Configurações de Elite';
      default: return 'Magnata Master';
    }
  };

  return (
    <header className="h-20 bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30 px-6 md:px-10 ml-0 md:ml-64 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Page Title for Context */}
        <h2 className="hidden md:block text-[10px] font-black text-amber-500/50 uppercase tracking-[0.4em] translate-y-0.5">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 transition-all relative border border-white/5 group">
          <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-black shadow-[0_0_10px_rgba(212,175,55,0.5)]"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Admin Master</p>
            <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider mt-1">Acesso Total</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-amber-500 transition-all group">
            <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </header>
  );
}
