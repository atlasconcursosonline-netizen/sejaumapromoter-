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
  Clock
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Promoter {
  id: string;
  name: string;
  ref_code: string;
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

  useEffect(() => {
    fetchPromoters();
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [{ count: leadCount }, { count: promoterCount }] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('promoters').select('*', { count: 'exact', head: true })
      ]);
      setCounts({ 
        promoters: promoterCount || 0, 
        leads: leadCount || 0 
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }

  async function fetchPromoters() {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('promoters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoters(data || []);
    } catch (err: any) {
      console.error('Error fetching promoters:', err);
      setError('Houve um erro ao carregar os promotores. Verifique sua conexão ou configuração do Supabase.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPromoter(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('promoters')
        .insert([{ 
          name: newPromoterName, 
          ref_code: newPromoterRef.toLowerCase().replace(/\s+/g, '-') 
        }]);

      if (error) throw error;
      
      setIsAddModalOpen(false);
      setNewPromoterName('');
      setNewPromoterRef('');
      fetchPromoters();
      fetchStats();
    } catch (err: any) {
      console.error('Error adding promoter:', err);
      alert('Erro ao adicionar promotor: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePromoter(id: string) {
    if (!confirm('Deseja realmente remover este promotor?')) return;
    
    try {
      const { error } = await supabase
        .from('promoters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPromoters();
      fetchStats();
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
          { label: 'Total de Promotores', value: counts.promoters, icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Recrutas Cadastrados', value: counts.leads, icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Status do Sistema', value: 'HEALTHY', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass p-8 rounded-[2rem] border-white/5 flex items-center gap-6 hover:border-amber-500/20 transition-all group">
            <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-current opacity-60 group-hover:opacity-100 transition-opacity`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-3xl font-display font-black text-white mt-1 group-hover:text-amber-500 transition-colors">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
        
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.02]">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Localizar promoter por nome ou REF..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/30 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10">
            <Clock className="w-3.5 h-3.5" />
            Última atualização: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className="px-8 py-5 text-[10px] font-black text-amber-500 uppercase tracking-[0.25em]">Membro da Equipe</th>
                <th className="px-8 py-5 text-[10px] font-black text-amber-500 uppercase tracking-[0.25em]">Código Identificador</th>
                <th className="px-8 py-5 text-[10px] font-black text-amber-500 uppercase tracking-[0.25em]">Link Personalizado</th>
                <th className="px-8 py-5 text-[10px] font-black text-amber-500 uppercase tracking-[0.25em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Sincronizando com Supabase...</p>
                  </td>
                </tr>
              ) : promoters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <Users className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs italic">Nenhum promotor recrutado ainda.</p>
                  </td>
                </tr>
              ) : (
                promoters.map((promoter) => (
                  <tr key={promoter.id} className="hover:bg-white/[0.04] transition-all group border-l-2 border-transparent hover:border-amber-500/50">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-zinc-500 group-hover:premium-gradient group-hover:text-black transition-all uppercase text-lg">
                          {promoter.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-black text-white tracking-widest uppercase block text-sm group-hover:text-amber-500 transition-colors">{promoter.name}</span>
                          <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider">Membro ativo</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="bg-white/5 px-4 py-2 rounded-lg text-amber-500 font-mono text-sm border border-white/10 uppercase tracking-widest">
                        {promoter.ref_code}
                      </code>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/10 group-hover:border-amber-500/30 transition-colors flex items-center gap-2">
                           <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest truncate max-w-[150px]">
                            {generateLink(promoter.ref_code).replace('https://', '').replace('http://', '')}
                          </span>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(generateLink(promoter.ref_code), promoter.id)}
                          className={`p-2.5 rounded-xl transition-all ${
                            copyStatus === promoter.id 
                              ? 'bg-emerald-500 text-black' 
                              : 'bg-white/5 hover:bg-amber-500 hover:text-black text-zinc-500'
                          } shadow-lg`}
                        >
                          {copyStatus === promoter.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => window.open(generateLink(promoter.ref_code), '_blank')}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/20 transition-all border border-transparent hover:border-amber-500/30"
                          title="Recrutamento"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePromoter(promoter.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:text-red-500 hover:bg-red-500/20 transition-all border border-transparent hover:border-red-500/30"
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
