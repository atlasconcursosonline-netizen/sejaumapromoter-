import React, { useState, useEffect } from 'react';
import { Film, Upload, Trash2, CheckCircle2, Loader2, Globe, Play, Tablet as FileVideo } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Media() {
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchMediaSettings();
  }, []);

  async function fetchMediaSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('hero_video_url, atracaonacional_video_url')
        .eq('id', 1)
        .single();
      
      const sanitize = (url: string | null) => {
        if (!url || url.includes('COLE_O_LINK') || url.includes('UNDEFINED')) return '';
        return url;
      };

      if (data) {
        setVideoUrl(sanitize(data.hero_video_url));
      }
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setStatus(null);
      
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `hero_video_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('midia_magnata')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('midia_magnata')
        .getPublicUrl(filePath);

      // 3. Save to site_settings using the new column structure
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ hero_video_url: publicUrl })
        .eq('id', 1);

      if (updateError) throw updateError;

      setVideoUrl(publicUrl);
      setStatus('Sucesso! Vídeo atualizado no site.');
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      console.error('Erro no upload:', err);
      alert('Erro ao fazer upload. Verifique o bucket "midia_magnata".');
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = async () => {
    if (!window.confirm('Deseja realmente remover o vídeo? O site voltará a exibir os banners estáticos.')) return;
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ hero_video_url: '' })
        .eq('id', 1);

      if (error) throw error;
      setVideoUrl('');
      setStatus('Vídeo removido com sucesso.');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error('Erro ao remover:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-black text-transparent bg-clip-text text-gradient-gold uppercase tracking-widest">Media Assets</h1>
          <p className="text-zinc-500 mt-2 font-medium">Gerencie os vídeos e destaques visuais do ecossistema.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Video Upload */}
          <div className="glass backdrop-blur-xl rounded-[2.5rem] border-white/5 p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Film className="w-40 h-40 text-amber-500" />
            </div>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/5 flex items-center justify-center text-amber-500/70 border border-amber-500/10">
                <FileVideo className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-black text-white uppercase tracking-widest">Destaque Nacional (Hero)</h3>
            </div>

            <div className="space-y-8 relative z-10">
              {videoUrl ? (
                <div className="space-y-6">
                  <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden border border-white/10 group/player relative shadow-2xl">
                    <video 
                      src={videoUrl} 
                      className="w-full h-full object-cover opacity-80"
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">Preview Ativo</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex-1">
                      <input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden" 
                      />
                      <div className="w-full py-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-amber-500/30 rounded-2xl text-center cursor-pointer transition-all flex items-center justify-center gap-3 group/btn">
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> : <Upload className="w-5 h-5 text-zinc-500 group-hover/btn:text-amber-500 transition-colors" />}
                        <span className="text-xs font-black uppercase text-zinc-500 group-hover/btn:text-white transition-colors">Trocar Vídeo</span>
                      </div>
                    </label>
                    <button 
                      onClick={removeVideo}
                      className="w-20 h-16 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/10 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block group/drop">
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden" 
                  />
                  <div className="w-full border-2 border-dashed border-white/5 hover:border-amber-500/30 bg-white/[0.01] hover:bg-amber-500/[0.02] rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center transition-all cursor-pointer">
                    <div className="w-20 h-20 rounded-[2rem] bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-800 mb-8 group-hover/drop:scale-110 group-hover/drop:text-amber-500 group-hover/drop:bg-black transition-all duration-500">
                       {uploading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Upload className="w-10 h-10" />}
                    </div>
                    <h4 className="text-white font-display font-black uppercase tracking-[0.25em] mb-4">Upload do Show</h4>
                    <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-xs">
                      Arraste um vídeo (.mp4 ou .webm) ou clique para selecionar. Recomendamos vídeos curtos (max 20MB).
                    </p>
                  </div>
                </label>
              )}

              {status && (
                <div className="flex items-center gap-3 text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">{status}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass backdrop-blur-xl rounded-[2.5rem] border-white/5 p-8 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent pointer-events-none" />
            <h3 className="text-xl font-display font-black text-white uppercase tracking-widest mb-8">Status Global</h3>
            <div className="space-y-4">
              <StatusCardItem label="Storage Bucket" status="Active" active={true} />
              <StatusCardItem label="Hero Media" status={videoUrl ? 'On Air' : 'None'} active={!!videoUrl} />
              <StatusCardItem label="Compression" status="Auto" active={true} />
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] text-zinc-500 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-4 h-4 text-amber-500/50" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Distribuição</h4>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">
              O vídeo carregado aqui será servido via CDN global para todos os visitantes do site oficial <strong className="text-amber-500/70">sejaumapromoter.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCardItem({ label, status, active }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.03] last:border-0 group">
      <span className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
        <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-emerald-500' : 'text-red-500'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
