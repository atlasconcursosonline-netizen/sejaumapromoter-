import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Search, 
  Copy, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  X,
  Loader2,
  AlertCircle,
  ArrowRight,
  Star,
  ShieldCheck,
  Clock,
  Instagram,
  UserCheck,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Promoter {
  id: string;
  name: string;
  ref_code: string;
  created_at: string;
  lead_count?: number;
}

interface Lead {
  id: string;
  name: string;
  age: number;
  instagram: string;
  created_at: string;
}

export default function Promoters() {
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [counts, setCounts] = useState({ promoters: 0, leads: 0 });
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPromoterName, setNewPromoterName] = useState('');
  const [newPromoterRef, setNewPromoterRef] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drill-down states
  const [selectedPromoter, setSelectedPromoter] = useState<Promoter | null>(null);
  const [leadsForSelected, setLeadsForSelected] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch Stats
      const [{ count: leadCount }, { data: promoterData }] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('promoters').select('*').order('name')
      ]);

      if (!promoterData) return;

      // Fetch lead counts for each promoter to build the ranking
      const { data: leadStats } = await supabase
        .from('leads')
        .select('referred_by');

      const statsMap: Record<string, number> = {};
      leadStats?.forEach(l => {
        if (l.referred_by) {
          statsMap[l.referred_by] = (statsMap[l.referred_by] || 0) + 1;
        }
      });

      const promotersWithStats = promoterData.map(p => ({
        ...p,
        lead_count: statsMap[p.ref_code] || 0
      })).sort((a, b) => (b.lead_count || 0) - (a.lead_count || 0));

      setPromoters(promotersWithStats);
      setCounts({ 
        promoters: promoterData.length || 0, 
        leads: leadCount || 0 
      });

    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPromoter(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('promoters')
        .insert([{ name: newPromoterName, ref_code: newPromoterRef.toLowerCase() }]);

      if (error) throw error;
      
      setIsAddModalOpen(false);
      setNewPromoterName('');
      setNewPromoterRef('');
      fetchData();
    } catch (err: any) {
      console.error('Error adding promoter:', err);
      alert('Erro ao adicionar promotor: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePromoter(id: string) {
    if (!confirm('Tem certeza que deseja remover este promoter da equipe?')) return;
    
    try {
      const { error } = await supabase
        .from('promoters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err: any) {
      console.error('Error deleting promoter:', err);
      alert('Erro ao deletar: ' + err.message);
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const generateLink = (refCode: string) => {
    return `${window.location.origin}/?ref=${refCode}`;
  };

  const handleOpenStats = async (promoter: Promoter) => {
    setSelectedPromoter(promoter);
    setLoadingLeads(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('referred_by', promoter.ref_code)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeadsForSelected(data || []);
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const filteredPromoters = promoters.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.ref_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-transparent bg-clip-text text-gradient-gold uppercase tracking-widest">Equipe de Promotores</h1>
          <p className="text-zinc-500 mt-2 font-medium">Controle de acesso e monitoramento de performance da elite Magnata.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="premium-gradient text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Cadastrar Promoter
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-bold uppercase tracking-wider">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total de Promotores', value: counts.promoters, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/5' },
          { label: 'Recrutas Cadastrados', value: counts.leads, icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/5' },
          { label: 'Melhor Desempenho', value: promoters[0]?.name || 'N/A', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
        ].map((stat, i) => (
          <div key={i} className="glass backdrop-blur-xl p-8 rounded-[2rem] border-white/5 flex items-center gap-6 hover:border-amber-500/20 transition-all group">
            <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-amber-500/10 opacity-60 group-hover:opacity-100 transition-opacity`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-2xl font-display font-black text-white mt-1 group-hover:text-amber-500 transition-colors uppercase truncate max-w-[200px]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="glass backdrop-blur-xl rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent pointer-events-none" />
        
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.01]">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Localizar promoter por nome ou REF..." 
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-800 focus:outline-none focus:border-amber-500/20 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
            <Clock className="w-3.5 h-3.5" />
            Última atualização: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border-spacing-0">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-black text-amber-500/70 uppercase tracking-[0.3em] whitespace-nowrap">Promoter / Ranking</th>
                <th className="px-8 py-6 text-[10px] font-black text-amber-500/70 uppercase tracking-[0.3em] whitespace-nowrap">Código (REF)</th>
                <th className="px-8 py-6 text-[10px] font-black text-amber-500/70 uppercase tracking-[0.3em] whitespace-nowrap">Indicações</th>
                <th className="px-8 py-6 text-[10px] font-black text-amber-500/70 uppercase tracking-[0.3em] text-right whitespace-nowrap px-10">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Sincronizando com Supabase...</p>
                  </td>
                </tr>
              ) : filteredPromoters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <Users className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-700 font-bold uppercase tracking-widest text-[10px] italic">Nenhum promotor encontrado.</p>
                  </td>
                </tr>
              ) : (
                filteredPromoters.map((promoter, index) => (
                  <tr key={promoter.id} className="hover:bg-white/[0.03] transition-all group border-l-2 border-transparent hover:border-amber-500/40">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-zinc-600 group-hover:premium-gradient group-hover:text-black transition-all uppercase text-lg shadow-inner">
                            {promoter.name.charAt(0)}
                          </div>
                          {index < 3 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full premium-gradient text-black font-black text-[10px] flex items-center justify-center border-2 border-black">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-black text-white tracking-widest uppercase block text-sm group-hover:text-amber-500 transition-colors">{promoter.name}</span>
                          <span className="text-[10px] text-zinc-700 uppercase font-bold tracking-wider">Membro Master Digital</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="bg-white/5 px-4 py-2 rounded-xl text-amber-500/70 font-mono text-xs border border-white/10 uppercase tracking-widest font-bold">
                        {promoter.ref_code}
                      </code>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleOpenStats(promoter)}
                        className="flex items-center gap-3 group/leads"
                      >
                        <div className="bg-black/40 px-4 py-2.5 rounded-xl border border-white/5 group-hover/leads:border-amber-500/30 transition-colors flex items-center gap-3">
                           <UserCheck className="w-4 h-4 text-amber-500/40 group-hover/leads:text-amber-500" />
                           <span className="text-white text-lg font-black tracking-widest">
                            {promoter.lead_count || 0}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest hidden lg:block group-hover/leads:text-white transition-colors">Ver Recrutas</span>
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right px-10">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => copyToClipboard(generateLink(promoter.ref_code), promoter.id)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${
                            copyStatus === promoter.id 
                              ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg' 
                              : 'bg-white/5 text-zinc-600 hover:text-white border-white/5'
                          }`}
                          title="Copiar Link"
                        >
                          {copyStatus === promoter.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => window.open(generateLink(promoter.ref_code), '_blank')}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-600 hover:text-amber-500 hover:bg-amber-500/10 transition-all border border-white/5 hover:border-amber-500/20"
                          title="Visualizar Página"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePromoter(promoter.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5 hover:border-red-500/20"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leads Detail Drawer */}
      <AnimatePresence>
        {selectedPromoter && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPromoter(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-black border-l border-amber-500/20 z-[71] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-black text-transparent bg-clip-text text-gradient-gold uppercase tracking-widest">Recrutas de {selectedPromoter.name.split(' ')[0]}</h3>
                  <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mt-1">Lista nominal de indicações</p>
                </div>
                <button onClick={() => setSelectedPromoter(null)} className="p-3 rounded-2xl bg-white/5 text-zinc-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {loadingLeads ? (
                  <div className="h-40 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                    <p className="text-zinc-700 font-bold uppercase tracking-widest text-[10px]">Acessando registros...</p>
                  </div>
                ) : leadsForSelected.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-center">
                    <UserCheck className="w-12 h-12 text-zinc-900 mb-4" />
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Este promoter ainda não possui recrutas.</p>
                  </div>
                ) : (
                  leadsForSelected.map((lead, i) => (
                    <motion.div 
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass p-6 rounded-3xl border-white/5 flex items-center justify-between group overflow-hidden relative"
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-amber-500/40 uppercase">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-1">{lead.name}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-zinc-600 font-black uppercase">{lead.age} anos</span>
                            <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                            <a 
                              href={`https://instagram.com/${lead.instagram}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] text-amber-500/70 font-black uppercase tracking-widest flex items-center gap-1 hover:text-amber-500 transition-colors"
                            >
                              <Instagram className="w-3 h-3" /> @{lead.instagram}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end relative z-10">
                         <div className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase px-2 py-1 rounded-md border border-emerald-500/20 mb-2">Verificado</div>
                         <p className="text-[9px] text-zinc-700 font-medium">{new Date(lead.created_at).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              
              <div className="p-8 bg-zinc-950/80 border-t border-white/5 backdrop-blur-xl">
                 <button className="w-full py-5 premium-gradient text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-amber-500/10">
                    Exportar Lista (PDF)
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Promoter Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
              onClick={() => setIsAddModalOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[61] p-4 pointer-events-none">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className="bg-black border border-amber-500/30 w-full max-w-md rounded-[2.5rem] p-10 pointer-events-auto relative overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.1)]"
              >
                <div className="absolute top-0 right-0 p-6">
                  <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-600 hover:text-white transition-colors p-2 text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-10 text-center">
                  <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-black mb-6 mx-auto shadow-xl shadow-amber-500/20">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-display font-black text-transparent bg-clip-text text-gradient-gold uppercase tracking-widest">Novo Promoter</h3>
                  <p className="text-zinc-500 text-sm mt-2 font-medium">Designado para a equipe de elite.</p>
                </div>

                <form onSubmit={handleAddPromoter} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] ml-1">Nome Completo</label>
                    <input 
                      required
                      type="text" 
                      value={newPromoterName}
                      onChange={(e) => setNewPromoterName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-bold tracking-wide shadow-inner"
                      placeholder="NOME DO CANDIDATO"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] ml-1">Código Identificador (REF)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-lg leading-none">@</span>
                      <input 
                        required
                        type="text" 
                        value={newPromoterRef}
                        onChange={(e) => setNewPromoterRef(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white hover:text-amber-500 hover:border-amber-500/10 placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm uppercase"
                        placeholder="IDENTIFICADOR"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 rounded-xl premium-gradient disabled:opacity-50 text-black font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 group mt-4 h-16"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        Confirmar Cadastro
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


      {/* Add Promoter Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
              onClick={() => setIsAddModalOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[61] p-4 pointer-events-none">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className="bg-black border border-amber-500/30 w-full max-w-md rounded-[2.5rem] p-10 pointer-events-auto relative overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.1)]"
              >
                <div className="absolute top-0 right-0 p-6">
                  <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-600 hover:text-white transition-colors p-2">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-10 text-center">
                  <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-black mb-6 mx-auto shadow-xl shadow-amber-500/20">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-display font-black text-transparent bg-clip-text text-gradient-gold uppercase tracking-widest">Novo Promoter</h3>
                  <p className="text-zinc-500 text-sm mt-2 font-medium">Designado para a equipe de elite.</p>
                </div>

                <form onSubmit={handleAddPromoter} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] ml-1">Nome Completo</label>
                    <input 
                      required
                      type="text" 
                      value={newPromoterName}
                      onChange={(e) => setNewPromoterName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-bold tracking-wide shadow-inner"
                      placeholder="NOME DO CANDIDATO"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] ml-1">Código Identificador (REF)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-lg leading-none">@</span>
                      <input 
                        required
                        type="text" 
                        value={newPromoterRef}
                        onChange={(e) => setNewPromoterRef(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 pl-12 text-amber-500 placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm uppercase"
                        placeholder="IDENTIFICADOR"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 rounded-xl premium-gradient disabled:opacity-50 text-black font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 group mt-4 h-16"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        Confirmar Cadastro
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
