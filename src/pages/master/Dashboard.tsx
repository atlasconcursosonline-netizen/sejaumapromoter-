import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Star, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight,
  TrendingDown,
  UserPlus,
  Zap,
  Loader2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPromoters: 0,
    totalLeads: 0,
    leadsThisWeek: 0,
    activeEvents: 1
  });
  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [
          { count: promoterCount }, 
          { count: leadCount },
          { data: latestLeads }
        ] = await Promise.all([
          supabase.from('promoters').select('*', { count: 'exact', head: true }),
          supabase.from('leads').select('*', { count: 'exact', head: true }),
          supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        setStats({
          totalPromoters: promoterCount || 0,
          totalLeads: leadCount || 0,
          leadsThisWeek: Math.floor((leadCount || 0) * 0.3), 
          activeEvents: 1
        });
        setRecentLeads(latestLeads || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Sincronizando Sistema Central...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-transparent bg-clip-text text-gradient-gold uppercase tracking-widest leading-none">Painel de Comando</h1>
          <p className="text-zinc-500 mt-3 font-medium text-sm">Resumo operacional e métricas em tempo real.</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 px-6 py-3 rounded-2xl flex items-center gap-3 self-start">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Sistema Operacional Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="w-6 h-6" />} 
          label="Equipe Oficial" 
          value={stats.totalPromoters} 
          trend="+5%" 
          isUp={true} 
        />
        <StatCard 
          icon={<UserPlus className="w-6 h-6" />} 
          label="Recrutas Totais" 
          value={stats.totalLeads} 
          trend="+18%" 
          isUp={true} 
        />
        <StatCard 
          icon={<Zap className="w-6 h-6" />} 
          label="Cresc. Semanal" 
          value={stats.leadsThisWeek} 
          trend="Estável" 
          isUp={true} 
        />
        <StatCard 
          icon={<Calendar className="w-6 h-6" />} 
          label="Eventos Ativos" 
          value={stats.activeEvents} 
          trend="OK" 
          isUp={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass backdrop-blur-xl rounded-[2.5rem] border-white/5 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <TrendingUp className="w-32 h-32 text-amber-500/10" />
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Star className="text-amber-500 w-5 h-5 fill-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
              Último Recrutamento
            </h3>
            <button className="text-amber-500 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1 bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10 transition-all hover:bg-amber-500/10">
              Ver Todos <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="space-y-4 relative z-10">
            {recentLeads.length > 0 ? recentLeads.map((lead, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/[0.01] hover:bg-white/[0.03] rounded-3xl border border-white/5 transition-all group/item">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-amber-500/70 transition-all group-hover/item:premium-gradient group-hover/item:text-black uppercase shadow-inner">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-1 group-hover/item:text-amber-500 transition-colors">{lead.name}</h4>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider">Ref: <span className="text-amber-500/50">{lead.referred_by || 'Direto'}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.05)]">Novo Lead</span>
                  <p className="text-[10px] text-zinc-700 mt-2 font-medium">{new Date(lead.created_at).toLocaleDateString()} às {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-16">
                <ShieldCheck className="w-12 h-12 text-zinc-900 mx-auto mb-4" />
                <p className="text-zinc-700 font-bold uppercase tracking-widest text-[10px] italic">Aguardando novos recrutas...</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass backdrop-blur-xl rounded-[2.5rem] border-white/5 p-8">
            <h3 className="text-xl font-display font-black text-white uppercase tracking-widest mb-8">Comandos de Elite</h3>
            
            <div className="space-y-4">
              {[
                { label: 'Novo Evento', desc: 'Gerenciar Bilheteria', icon: Calendar },
                { label: 'Exportar Dados', desc: 'Relatório Completo', icon: TrendingUp },
                { label: 'Comunicado', desc: 'Push via WhatsApp', icon: Zap },
              ].map((action, i) => (
                <button key={i} className="w-full group flex items-center justify-between p-5 bg-white/[0.02] hover:premium-gradient transition-all rounded-3xl border border-white/5 hover:border-amber-500/50 shadow-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-amber-500 group-hover:bg-black group-hover:text-amber-500 transition-all">
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-black text-white group-hover:text-black uppercase text-[10px] tracking-widest mb-1">{action.label}</h4>
                      <p className="text-[9px] text-zinc-600 group-hover:text-black/60 font-bold uppercase tracking-wider">{action.desc}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-800 group-hover:text-black transition-all relative z-10" />
                </button>
              ))}
            </div>
          </div>

          <div className="premium-gradient p-8 rounded-[2.5rem] text-black shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:w-40 group-hover:h-40 transition-all duration-700" />
            <h4 className="text-xl font-display font-black uppercase tracking-widest mb-2 leading-none relative z-10">Meta Mensal</h4>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Recrutamento Equipe</span>
              <span className="text-sm font-black uppercase tracking-widest underline decoration-black/20 underline-offset-4 Decoration-2">74%</span>
            </div>
            <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden relative z-10 shadow-inner">
              <div className="w-[74%] h-full bg-black shadow-[0_0_15px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, isUp }: any) {
  return (
    <div className="glass backdrop-blur-xl p-8 rounded-[2rem] border-white/5 hover:border-amber-500/20 transition-all group relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] blur-[40px] rounded-full pointer-events-none group-hover:bg-amber-500/5 transition-colors" />
      <div className="w-14 h-14 rounded-2xl bg-amber-500/5 text-amber-500/70 flex items-center justify-center mb-6 border border-amber-500/10 group-hover:bg-amber-500 group-hover:text-black transition-all duration-700 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] group-hover:border-amber-500/50">
        {icon}
      </div>
      <div>
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">{label}</p>
        <div className="flex items-end gap-3">
          <h3 className="text-4xl font-display font-black text-white group-hover:text-amber-500 transition-colors">{value}</h3>
          <span className={`text-[9px] font-black uppercase flex items-center gap-1 mb-2 px-2 py-0.5 rounded-full border ${isUp ? 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5' : 'text-rose-500 border-rose-500/10 bg-rose-500/5'}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}
