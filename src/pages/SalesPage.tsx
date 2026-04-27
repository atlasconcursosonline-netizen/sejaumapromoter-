import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function SalesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ref = searchParams.get('ref');
  const [attributing, setAttributing] = useState(false);

  useEffect(() => {
    if (ref) {
      console.log('Atribuindo venda ao promotor:', ref);
      setAttributing(true);
      // Aqui você poderia salvar no localStorage ou enviar um evento de analytics
      localStorage.setItem('promoter_ref', ref);
      setTimeout(() => setAttributing(false), 800);
    }
  }, [ref]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-full h-[50%] bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-full h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center relative z-10"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-amber-500/30">
          <Star className="text-black w-10 h-10" fill="currentColor" />
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-6">
          BAILE DO <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200">MAGNATA</span>
        </h1>
        
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          O evento mais exclusivo do ano está chegando. Garanta seu lugar no camarote VIP.
        </p>

        {attributing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-widest"
          >
            <ShieldCheck className="w-4 h-4" />
            Link de Promotor Ativado: {ref}
          </motion.div>
        )}

        <div className="space-y-4 mb-12">
          {[
            "Acesso Exclusivo Front-stage",
            "Open Bar Premium (Consulte Setor)",
            "Atrações Nacionais Confirmadas"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 justify-center text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>

        <button className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black text-lg uppercase tracking-widest shadow-2xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 group">
          <Zap className="w-6 h-6 fill-current" />
          Comprar Ingressos
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-8 text-gray-600 text-sm">
          Pagamento Seguro via PIX ou Cartão de Crédito
        </p>
      </motion.div>
    </div>
  );
}
