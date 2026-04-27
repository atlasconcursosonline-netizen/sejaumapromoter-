import React, { useState, cloneElement } from 'react';
import { Save, MessageSquare, Shield, Bell, Smartphone, Globe, Loader2, CheckCircle2 } from 'lucide-react';

export default function Config() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [waMessage, setWaMessage] = useState('Olá! Acabei de me cadastrar como promoter do Baile do Magnata.\n\nNome: {name}\nIdade: {age}\nInstagram: {instagram}\nRef: {ref}');

  const handleSave = () => {
    setLoading(true);
    // Em produção salvaria no Supabase em uma tabela 'settings'
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-black text-transparent bg-clip-text text-gradient-gold uppercase tracking-widest">Configurações</h1>
          <p className="text-zinc-500 mt-2 font-medium">Ajustes globais e parâmetros do ecossistema.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="premium-gradient text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-500/20 active:scale-95 disabled:opacity-50 h-[60px]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />
          )}
          {saved ? 'Alterações Salvas' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* WhatsApp Message Config */}
          <div className="glass backdrop-blur-xl rounded-[2.5rem] border-white/5 p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <MessageSquare className="w-40 h-40 text-amber-500" />
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/5 flex items-center justify-center text-amber-500/70 border border-amber-500/10">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-black text-white uppercase tracking-widest">Recrutamento Digital</h3>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Script de Resposta (WhatsApp)</label>
                <textarea 
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  className="w-full h-56 bg-black/40 border border-white/10 rounded-3xl p-8 text-zinc-400 font-medium text-sm focus:outline-none focus:border-amber-500/20 transition-all resize-none shadow-inner leading-relaxed"
                />
              </div>
              
              <div className="bg-amber-500/[0.02] border border-white/5 rounded-[2rem] p-8">
                <h4 className="text-amber-500/80 font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Variáveis Dinâmicas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['{name}', '{age}', '{instagram}', '{ref}'].map(tag => (
                    <code key={tag} className="glass px-4 py-2 rounded-xl text-amber-500/60 font-mono text-[10px] border-white/5 shadow-sm">{tag}</code>
                  ))}
                </div>
                <p className="text-zinc-700 font-medium text-[10px] uppercase tracking-wider mt-6 leading-relaxed">Injete dados do candidato automaticamente na mensagem final.</p>
              </div>
            </div>
          </div>

          {/* Security Config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingsCard 
              icon={<Shield />} 
              label="Proteção Master" 
              desc="Exigir 2FA para exclusão"
              active={true}
            />
            <SettingsCard 
              icon={<Bell />} 
              label="Notificações" 
              desc="Alertas de novos leads"
              active={false}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass backdrop-blur-xl rounded-[2.5rem] border-white/5 p-8 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent pointer-events-none" />
            <h3 className="text-xl font-display font-black text-white uppercase tracking-widest mb-8">Monitoramento</h3>
            <div className="space-y-4">
              <StatusItem label="Supabase DB" status="Healthy" type="success" />
              <StatusItem label="Edge Functions" status="Active" type="success" />
              <StatusItem label="WhatsApp Gateway" status="Connected" type="success" />
              <StatusItem label="CDN Global" status="Optimized" type="success" />
            </div>
          </div>

          <div className="bg-zinc-950/40 p-10 rounded-[2.5rem] border border-white/5 text-center relative overflow-hidden group shadow-2xl backdrop-blur-sm">
             <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent shadow-[0_0_20px_rgba(212,175,55,0.2)]" />
             <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-800 mx-auto mb-6 group-hover:text-amber-500/40 transition-colors">
                <Smartphone className="w-10 h-10" />
             </div>
             <h4 className="text-white font-black uppercase text-xs tracking-widest mb-3">Acesso Mobile</h4>
             <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">Administre o Magnata de qualquer lugar do mundo.</p>
             <button className="w-full py-5 bg-white/[0.03] hover:premium-gradient text-white hover:text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all shadow-lg active:scale-95">
                GERAR PWA MASTER
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ icon, label, desc, active }: any) {
  return (
    <div className="glass backdrop-blur-xl p-8 rounded-[2rem] border-white/5 flex items-center justify-between group hover:border-amber-500/10 transition-all">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-amber-500 transition-all">
          {cloneElement(icon, { className: 'w-5 h-5' })}
        </div>
        <div>
          <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-1">{label}</h4>
          <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-wider">{desc}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-all duration-500 cursor-pointer p-1 ${active ? 'bg-amber-500 shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-zinc-900'}`}>
        <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-lg ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}

function StatusItem({ label, status, type }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.03] last:border-0 group">
      <span className="text-zinc-600 font-black uppercase text-[10px] tracking-widest group-hover:text-zinc-400 transition-colors">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${type === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(212,175,55,0.5)]'}`} />
        <span className={`text-[10px] font-black uppercase tracking-widest ${type === 'success' ? 'text-emerald-500' : 'text-amber-500'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
