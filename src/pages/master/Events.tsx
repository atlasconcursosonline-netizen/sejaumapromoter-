import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Ticket, Image as ImageIcon, ExternalLink, Plus, Star, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Events() {
  const [leadCount, setLeadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEventStats() {
      try {
        const { count } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true });
        
        setLeadCount(count || 0);
      } catch (err) {
        console.error('Erro ao buscar stats do evento:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEventStats();
  }, []);

  const event = {
    id: 1,
    title: "Baile do Magnata 2024",
    date: "30 de Maio",
    location: "Fraga Lounge",
    status: "Confirmado",
    leads: leadCount
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Sincronizando Dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-transparent bg-clip-text text-gradient-gold uppercase tracking-widest">Gestão de Eventos</h1>
          <p className="text-zinc-500 mt-2 font-medium">Controle de bilheteria e atrações do Baile.</p>
        </div>
        <button className="premium-gradient text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 active:scale-95 group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div key={event.id} className="glass backdrop-blur-xl rounded-[2.5rem] border-white/5 overflow-hidden group shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent pointer-events-none" />
          <div className="h-56 bg-zinc-950 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
             <div className="absolute top-8 left-8 z-20 px-5 py-2.5 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]">
               Evento Confirmado
             </div>
             {/* Placeholder for event cover */}
             <div className="absolute inset-0 flex items-center justify-center text-zinc-900">
                <ImageIcon className="w-20 h-20 opacity-30 group-hover:scale-110 group-hover:text-amber-500 transition-all duration-700" />
             </div>
          </div>
          
          <div className="p-10 space-y-10 relative z-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-3xl font-display font-black text-white uppercase tracking-widest group-hover:text-amber-500 transition-colors">{event.title}</h3>
                <div className="flex items-center gap-6 mt-3 text-zinc-600 font-bold uppercase text-[10px] tracking-[0.3em]">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-500/40" /> {event.date}</span>
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500/40" /> {event.location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Users, label: 'Confirmações', val: event.leads > 0 ? `${Math.ceil(event.leads * 0.8)}` : '-' },
                { icon: Ticket, label: 'Leads Reais', val: event.leads },
                { icon: Star, label: 'Status', val: 'ATIVO' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.01] border border-white/5 p-6 rounded-[1.5rem] text-center hover:bg-white/[0.03] transition-colors group/stat">
                  <stat.icon className="w-5 h-5 text-zinc-800 mx-auto mb-3 group-hover/stat:text-amber-500 transition-colors" />
                  <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-xl font-display font-black text-white group-hover/stat:text-amber-500 transition-colors uppercase">{stat.val}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button className="flex-1 py-5 bg-white/[0.02] hover:bg-amber-500 hover:text-black hover:font-black text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/10 hover:border-amber-500/50 shadow-lg active:scale-95 leading-none">
                Gerenciar Reserva
              </button>
              <button className="w-16 h-16 flex items-center justify-center bg-black/40 border border-white/10 text-zinc-700 hover:text-amber-500 hover:border-amber-500/30 rounded-2xl transition-all shadow-inner group/btn">
                <ExternalLink className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="glass backdrop-blur-xl rounded-[2.5rem] border-white/5 p-10 border-dashed border-2 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-amber-500/20 transition-all bg-white/[0.01]">
          <div className="w-20 h-20 rounded-[2rem] bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-900 mb-8 group-hover:scale-110 group-hover:text-amber-500/30 group-hover:bg-black transition-all duration-500">
             <Plus className="w-10 h-10" />
          </div>
          <h4 className="text-white font-display font-black uppercase tracking-[0.25em] mb-3">Expandir Operação</h4>
          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest leading-relaxed">Agendar novos palcos da elite.</p>
        </div>
      </div>
    </div>
  );
}
