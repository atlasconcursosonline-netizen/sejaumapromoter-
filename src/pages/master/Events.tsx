import React from 'react';
import { Calendar, MapPin, Users, Ticket, Image as ImageIcon, ExternalLink, Plus, Star } from 'lucide-react';

export default function Events() {
  const events = [
    {
      id: 1,
      title: "Baile do Magnata 2024",
      date: "25 de Maio",
      location: "Espaço Premium Vitória",
      status: "Em Breve",
      leads: 142
    }
  ];

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
        {events.map((event) => (
          <div key={event.id} className="glass rounded-[2.5rem] border-white/5 overflow-hidden group shadow-2xl">
            <div className="h-48 bg-zinc-900 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
               <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full">
                 Confirmação de Elite
               </div>
               {/* Placeholder for event cover */}
               <div className="absolute inset-0 flex items-center justify-center text-zinc-800">
                  <ImageIcon className="w-16 h-16 opacity-20" />
               </div>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-widest group-hover:text-amber-500 transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                    <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-amber-500/50" /> {event.date}</span>
                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-500/50" /> {event.location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center">
                  <Users className="w-5 h-5 text-amber-500/50 mx-auto mb-2" />
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Público Estimado</p>
                  <p className="text-xl font-display font-black text-white">2.5k</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center">
                  <Ticket className="w-5 h-5 text-amber-500/50 mx-auto mb-2" />
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Leads Atuais</p>
                  <p className="text-xl font-display font-black text-white">{event.leads}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center">
                  <Star className="w-5 h-5 text-amber-500/50 mx-auto mb-2" />
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Conversão</p>
                  <p className="text-xl font-display font-black text-white">12%</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all border border-white/10">
                  Gerenciar Reserva
                </button>
                <button className="w-14 h-14 flex items-center justify-center bg-black border border-amber-500/30 text-amber-500 hover:premium-gradient hover:text-black rounded-xl transition-all">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="glass rounded-[2.5rem] border-white/5 p-10 border-dashed border-2 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-amber-500/30 transition-all">
          <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center text-zinc-700 mb-6 group-hover:scale-110 group-hover:text-amber-500 transition-all">
             <Plus className="w-10 h-10" />
          </div>
          <h4 className="text-white font-display font-black uppercase tracking-widest mb-2">Agendar Novo Baile</h4>
          <p className="text-zinc-600 text-sm font-medium">Amplie as operações para novas capitais.</p>
        </div>
      </div>
    </div>
  );
}
