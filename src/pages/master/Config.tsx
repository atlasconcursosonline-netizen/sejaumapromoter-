import React, { useState } from 'react';
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
          <div className="glass rounded-[2.5rem] border-white/5 p-10 relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-black text-white uppercase tracking-widest">Mensagem de Recrutamento</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Template de Resposta (WhatsApp)</label>
                <textarea 
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 text-zinc-300 font-medium text-sm focus:outline-none focus:border-amber-500/30 transition-all resize-none"
                />
              </div>
              
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6">
                <h4 className="text-amber-500 font-black uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Tags Disponíveis
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['{name}', '{age}', '{instagram}', '{ref}'].map(tag => (
                    <code key={tag} className="bg-black/60 px-3 py-1.5 rounded-lg text-amber-500/80 font-mono text-[10px] border border-white/5">{tag}</code>
                  ))}
                </div>
                <p className="text-zinc-600 font-medium text-xs mt-4">Estas tags serão substituídas automaticamente pelos dados reais do usuário no momento do cadastro.</p>
              </div>
            </div>
          </div>

          {/* Security Config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingsCard 
              icon={<Shield />} 
              label="Autenticação Master" 
              desc="Exigir 2FA para exclusão de equipe"
              active={true}
            />
            <SettingsCard 
              icon={<Bell />} 
              label="Alertas em Tempo Real" 
              desc="Notificar novo lead via App"
              active={false}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-[2.5rem] border-white/5 p-8 relative overflow-hidden">
            <h3 className="text-xl font-display font-black text-white uppercase tracking-widest mb-6">Status dos Serviços</h3>
            <div className="space-y-4">
              <StatusItem label="Supabase DB" status="Healthy" type="success" />
              <StatusItem label="Edge Functions" status="Active" type="success" />
              <StatusItem label="WhatsApp API" status="Connected" type="success" />
              <StatusItem label="Vercel Deploy" status="Idle" type="warning" />
            </div>
          </div>

          <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-white/5 text-center">
             <Smartphone className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
             <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">App Mobile Master</h4>
             <p className="text-zinc-500 text-[10px] font-medium leading-relaxed mb-6">Instale o painel de comando no seu dispositivo para acesso rápido.</p>
             <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl border border-white/10 transition-all">
                Baixar PWA
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ icon, label, desc, active }: any) {
  return (
    <div className="glass p-8 rounded-[2rem] border-white/5 flex items-center justify-between group">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-amber-500 transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-1">{label}</h4>
          <p className="text-zinc-600 font-medium text-[10px]">{desc}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-amber-500' : 'bg-zinc-800'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${active ? 'left-7' : 'left-1'}`} />
      </div>
    </div>
  );
}

function StatusItem({ label, status, type }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{label}</span>
      <span className={`text-[10px] font-black uppercase tracking-widest ${type === 'success' ? 'text-emerald-500' : 'text-amber-500 font-bold'}`}>
        {status}
      </span>
    </div>
  );
}
