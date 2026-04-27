import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Search, 
  Copy, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  CheckCircle2, 
  X,
  Loader2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Promoter {
  id: string;
  name: string;
  ref_code: string;
  created_at: string;
}

export default function Promoters() {
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPromoterName, setNewPromoterName] = useState('');
  const [newPromoterRef, setNewPromoterRef] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPromoters();
  }, []);

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
    return `${window.location.origin}/venda?ref=${refCode}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-wider">Gestão de Promotores</h1>
          <p className="text-slate-500 mt-1">Gerencie sua equipe de vendas e acompanhe os links de divulgação.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Novo Promotor
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total de Promotores', value: promoters.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Cliques Hoje', value: '428', icon: ExternalLink, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Conversão Média', value: '12.4%', icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border-slate-800 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="glass rounded-[2rem] border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou código..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/30">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Nome do Promotor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Código REF</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Link de Divulgação</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Carregando dados da equipe...</p>
                  </td>
                </tr>
              ) : promoters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium italic">Nenhum promotor cadastrado no momento.</p>
                  </td>
                </tr>
              ) : (
                promoters.map((promoter) => (
                  <tr key={promoter.id} className="hover:bg-slate-900/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-all uppercase">
                          {promoter.name.charAt(0)}
                        </div>
                        <span className="font-bold text-white tracking-wide">{promoter.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <code className="bg-slate-900 px-3 py-1.5 rounded-lg text-blue-400 font-mono text-sm border border-slate-800">
                        {promoter.ref_code}
                      </code>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 group/link">
                        <span className="text-slate-400 text-xs truncate max-w-[200px] font-medium">
                          {generateLink(promoter.ref_code)}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(generateLink(promoter.ref_code), promoter.id)}
                          className={`p-2 rounded-lg transition-all ${
                            copyStatus === promoter.id 
                              ? 'bg-emerald-500/20 text-emerald-500' 
                              : 'hover:bg-slate-800 text-slate-500 hover:text-white'
                          }`}
                          title="Copiar Link"
                        >
                          {copyStatus === promoter.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => window.open(generateLink(promoter.ref_code), '_blank')}
                          className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-blue-500 transition-all"
                          title="Ver Página de Venda"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePromoter(promoter.id)}
                          className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-red-500 transition-all"
                          title="Excluir Promotor"
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setIsAddModalOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[61] p-4 pointer-events-none">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2rem] p-8 pointer-events-auto relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-4">
                  <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                    <Plus className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-wider">Novo Promotor</h3>
                  <p className="text-slate-500 text-sm mt-1">Crie um novo código de acesso para sua equipe.</p>
                </div>

                <form onSubmit={handleAddPromoter} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Nome Completo</label>
                    <input 
                      required
                      type="text" 
                      value={newPromoterName}
                      onChange={(e) => setNewPromoterName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Código REF Personalizado</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-sm leading-none">@</span>
                      <input 
                        required
                        type="text" 
                        value={newPromoterRef}
                        onChange={(e) => setNewPromoterRef(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 pl-9 text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm"
                        placeholder="promoter-01"
                      />
                    </div>
                    <p className="text-[10px] text-slate-600 mt-2 italic px-1">O código será usado no link: ?ref=seu-codigo</p>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Cadastro'}
                    {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
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
