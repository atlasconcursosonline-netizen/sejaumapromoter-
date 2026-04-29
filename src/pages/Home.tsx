import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BarChart3, CheckCircle2, ChevronRight, Play, ShieldCheck, Star, Users, Zap, MapPin, X, Clock, HelpCircle, Instagram, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 5,
    minutes: 42,
    seconds: 10
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        return prev; // Static for demo as we don't have a real date yet
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-3 md:gap-8 items-center justify-center scale-90 md:scale-100">
      {[
        { label: 'Dias', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Seg', value: timeLeft.seconds },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <div className="text-3xl md:text-6xl font-display font-black text-white mb-1 drop-shadow-xl">{String(item.value).padStart(2, '0')}</div>
          <div className="text-[8px] md:text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "O que faz uma Promoter no Baile do Magnata?",
      a: "A promoter é a face do evento. Suas principais funções são a divulgação digital nas redes sociais, convidar seu círculo de influência e facilitar a venda de ingressos através de links exclusivos."
    },
    {
      q: "Quais são os principais requisitos?",
      a: "Ter mais de 18 anos, possuir um Instagram ativo com bom engajamento, ser comunicativa e ter identificação com o público de funk e trap de elite."
    },
    {
      q: "Como funciona a remuneração?",
      a: "Trabalhamos com um sistema híbrido: benefícios fixos (VIP, Lounge, Sorteios) + comissões agressivas por cada ingresso vendido através do seu link/perfil."
    },
    {
      q: "Preciso ter muitos seguidores?",
      a: "Não é necessário ser uma influencer gigante. Valorizamos o engajamento real e a capacidade de persuasão. Nossa equipe de coordenação analisará cada perfil individualmente."
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, i) => (
        <button
          key={i}
          onClick={() => setOpenIndex(openIndex === i ? null : i)}
          className="w-full text-left glass p-6 rounded-2xl border-white/5 hover:border-amber-500/20 transition-all group"
        >
          <div className="flex justify-between items-center gap-4">
            <h4 className="font-bold text-gray-200 group-hover:text-amber-400 transition-colors">{faq.q}</h4>
            <HelpCircle className={`w-5 h-5 text-amber-500/50 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
          </div>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="pt-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      ))}
    </div>
  );
}

function Animated3DText({ text, className = '', delayOffset = 0 }: { text: string, className?: string, delayOffset?: number }) {
  const colorClassMatch = className.match(/text-3d-(white|gold)/);
  const colorType = colorClassMatch ? colorClassMatch[1] : 'white';
  const containerClassName = className.replace(/text-3d-(white|gold)/, '');

  const words = text.split(' ');

  const renderLetters = (isShadow: boolean) => {
    return words.map((word, wIdx) => (
      <span key={wIdx} className="inline-block whitespace-nowrap">
        {word.split('').map((char, cIdx) => {
          const i = wIdx * 10 + cIdx;
          const yOffset = (i % 2 === 0 ? 1 : -1) * (i % 3 + 1.5);
          const rotXOffset = (i % 3 === 0 ? 1 : -1) * (i % 4 + 3);
          const rotYOffset = (i % 2 === 0 ? -1 : 1) * (i % 5 + 2);
          const rotZOffset = (i % 4 === 0 ? 1 : -1) * (i % 2 + 1);
          
          return (
            <motion.span
              key={cIdx}
              animate={{
                y: [0, yOffset, 0],
                rotateX: [0, rotXOffset, 0],
                rotateY: [0, rotYOffset, 0],
                rotateZ: [0, rotZOffset, 0],
              }}
              transition={{
                duration: 5 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: delayOffset + i * 0.08,
              }}
              className={`inline-block transform-style-3d p-1 -m-1 ${isShadow ? `text-3d-${colorType}-shadow` : `text-3d-${colorType}-gradient`}`}
              aria-hidden={isShadow ? "true" : undefined}
            >
              {char}
            </motion.span>
          );
        })}
        {wIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
      </span>
    ));
  };

  return (
    <span className={`${containerClassName} relative inline-flex justify-center`}>
      <span className="absolute inset-0 flex justify-center pointer-events-none z-0">
        {renderLetters(true)}
      </span>
      <span className="relative flex justify-center z-10 w-full h-full">
        {renderLetters(false)}
      </span>
    </span>
  );
}

function DecorativeGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-[100px]" />
    </div>
  );
}

function RegistrationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [instagram, setInstagram] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const referredBy = localStorage.getItem('promoter_ref') || 'direto';

    try {
      // Salvar no Supabase
      const { error } = await supabase
        .from('leads')
        .insert([{ 
          name, 
          age: parseInt(age), 
          instagram: instagram.replace('@', ''), 
          referred_by: referredBy,
          type: 'promoter_application'
        }]);

      if (error) throw error;

      // Abrir WhatsApp para confirmação direta
      const text = `Olá! Acabei de me cadastrar como promoter do Baile do Magnata.\n\nNome: ${name}\nIdade: ${age}\nInstagram: ${instagram}\nRef: ${referredBy}`;
      window.open(`https://wa.me/5577981181047?text=${encodeURIComponent(text)}`, '_blank');
      
      onClose();
      setName('');
      setAge('');
      setInstagram('');
    } catch (err: any) {
      console.error('Erro ao salvar lead:', err);
      alert('Houve um erro ao processar seu cadastro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-bg border border-amber-500/30 w-full max-w-md rounded-3xl p-8 relative pointer-events-auto gold-glow overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -ml-[150px] w-[300px] h-[300px] rounded-full bg-amber-600/10 blur-[80px] pointer-events-none" />
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-8 relative z-10">
                <h3 className="font-display font-black text-3xl uppercase tracking-wider text-transparent bg-clip-text text-gradient-gold mb-2">
                  Cadastro Oficial
                </h3>
                <p className="text-gray-400 text-sm font-medium">
                  Preencha seus dados para análise da equipe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/50 focus:bg-black/50 transition-all font-medium text-base h-16"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Idade</label>
                    <input 
                      required
                      type="number" 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="18"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/50 focus:bg-black/50 transition-all font-medium text-base h-16"
                      placeholder="Sua idade"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Instagram (@)</label>
                    <input 
                      required
                      type="text" 
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/50 focus:bg-black/50 transition-all font-medium text-base h-16"
                      placeholder="@seuinstagram"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 font-display premium-gradient text-black hover:brightness-110 flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-70 h-16"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Enviar para a Coordenação
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | null>('https://azlyuniavfnjgutidace.supabase.co/storage/v1/object/public/midia_magnata/hero_video_0.9536983006436293.mp4');
  const [nationalVideoUrl, setNationalVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeroSettings() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('hero_video_url, atracaonacional_video_url')
          .eq('id', 1)
          .single();
        
        const sanitize = (url: string | null) => {
          if (!url || url.includes('COLE_O_LINK') || url.includes('UNDEFINED')) return null;
          return url;
        };

        const dbHero = sanitize(data?.hero_video_url);
        const dbNational = sanitize(data?.atracaonacional_video_url);

        if (dbHero) setHeroVideoUrl(dbHero);
        if (dbNational) setNationalVideoUrl(dbNational);
      } catch (err) {
        console.log('Sem vídeo dinâmico, usando assets estáticos.');
      }
    }
    fetchHeroSettings();

    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('promoter_ref', ref);
      console.log('Rastreio de recrutamento ativado:', ref);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-dark-bg selection:bg-amber-500/30 selection:text-white relative font-sans overflow-x-hidden">
      {/* Background Video Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <video 
          key={heroVideoUrl}
          src={heroVideoUrl || 'https://azlyuniavfnjgutidace.supabase.co/storage/v1/object/public/midia_magnata/hero_video_0.9536983006436293.mp4'}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-20" />
      </div>

      <DecorativeGlow />
      
      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-bg/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">
            <div className="font-display font-black text-lg md:text-xl tracking-widest flex items-center gap-3 uppercase">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg premium-gradient flex items-center justify-center font-extrabold text-black text-xs shadow-xl shadow-amber-500/20">
                AP
              </div>
              <span className="hidden xs:inline">Acelera Produções</span>
              <span className="xs:hidden">AP</span>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="text-[10px] md:text-sm font-black text-amber-500 hover:text-amber-400 transition-colors duration-200 uppercase tracking-widest font-display cursor-pointer border border-amber-500/20 px-4 py-2 rounded-lg bg-amber-500/5 md:bg-transparent md:border-none md:p-0">
              Quero ser Promoter
            </button>
          </div>
      </nav>

      <main className="pt-28 md:pt-32 pb-24 px-5 relative z-10 w-full overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto flex flex-col items-center text-center mt-10 md:mt-16 mb-24 md:mb-32 relative">
          
          {/* Animated Background Images */}
          <motion.img 
            initial={{ opacity: 0, x: -30, y: 0 }}
            animate={{ opacity: 0.2, x: 0, y: [-15, 15, -15] }}
            transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 1 }, x: { duration: 1 } }}
            src="https://i.imgur.com/Tu6pgiV.png" 
            alt="Hero Element Left"
            className="absolute -left-10 md:-left-20 -top-10 w-48 md:w-64 lg:w-80 object-contain mix-blend-lighten z-0 pointer-events-none filter contrast-125 saturate-150"
            style={{ maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)' }}
          />
          <motion.img 
            initial={{ opacity: 0, x: 30, y: 0 }}
            animate={{ opacity: 0.2, x: 0, y: [15, -15, 15] }}
            transition={{ y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }, opacity: { duration: 1 }, x: { duration: 1 } }}
            src="https://i.imgur.com/95mpUfR.png" 
            alt="Hero Element Right"
            className="absolute -right-10 md:-right-20 top-20 w-48 md:w-64 lg:w-80 object-contain mix-blend-lighten z-0 pointer-events-none filter contrast-125 saturate-150"
            style={{ maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[9px] md:text-xs font-black tracking-[0.25em] uppercase mb-8 md:mb-12 relative z-20"
          >
            <Star className="w-3 md:w-3.5 h-3 md:h-3.5 fill-amber-500" />
            <span>Seleção 2026 • Feira de Santana - BA</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1200 }}
            className="mb-8 md:mb-12 z-20 w-full"
          >
            <motion.h1
              animate={{ rotateX: [4, -4, 4], rotateY: [-2, 2, -2], y: [-3, 3, -3] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="font-display font-black uppercase flex flex-col items-center transform-style-3d cursor-default drop-shadow-2xl"
            >
              <Animated3DText 
                text="SEJA UMA" 
                className="text-3d-white text-4xl sm:text-6xl md:text-8xl lg:text-[110px] tracking-tight leading-[0.85] z-10 relative mb-1 md:-mb-2" 
              />
              <Animated3DText 
                text="PROMOTER" 
                className="text-3d-gold text-5xl sm:text-7xl md:text-[80px] lg:text-[120px] tracking-tight leading-[0.85] relative z-20" 
                delayOffset={0.5} 
              />
            </motion.h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-14 font-medium px-4"
          >
            Faça parte da elite do <strong className="text-amber-400 font-display uppercase tracking-wider">Baile do Magnata</strong>. <br className="hidden md:block" /> 
            Ganhe visibilidade e acesso premium exclusivo.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-md md:max-w-none"
          >
            <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto h-16 md:h-20 group relative flex items-center justify-center gap-4 premium-gradient text-black px-10 rounded-2xl font-black text-sm md:text-lg shadow-2xl active:scale-95 transition-all uppercase tracking-[0.2em] font-display">
              Quero Me Cadastrar
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs font-black text-zinc-600 uppercase tracking-[0.25em] h-14">
               <MapPin className="w-4 h-4 text-amber-500/50" />
               Fraga Lounge • Feira de Santana - BA
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              icon={<Users />}
              value="150+" 
              label="Vagas exclusivas para promotoras de elite."
            />
            <StatsCard 
              icon={<Zap />}
              value="VIP" 
              label="Acesso grátis ao Lounge e Lounge Business."
            />
            <StatsCard 
              icon={<BarChart3 />}
              value="$$$" 
              label="Bonificações e prêmios por desempenho."
            />
          </div>
        </section>

        {/* Countdown Section */}
        <section className="max-w-7xl mx-auto mb-32 relative">
          <div className="relative z-10 text-center py-20 px-6 rounded-[2.5rem] bg-gradient-to-b from-amber-500/5 to-transparent border border-amber-500/20 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <span className="text-[10px] md:text-xs font-bold text-amber-500 uppercase tracking-[0.4em] mb-8 block">Inscrições encerram em</span>
            <CountdownTimer />
            <p className="mt-10 text-gray-500 text-sm font-medium uppercase tracking-widest">Apenas 12 vagas restantes para seleção imediata</p>
          </div>
        </section>

        {/* Info Grid (Visual Anchor) */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                style={{ perspective: 1200 }}
                className="mb-8 z-20 w-full"
              >
                <motion.h2
                  animate={{ rotateX: [5, -5, 5], rotateY: [-2, 4, -2], y: [-2, 2, -2] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="font-display text-4xl md:text-5xl lg:text-6xl font-black uppercase flex flex-col transform-style-3d cursor-default drop-shadow-2xl leading-[0.9]"
                >
                  <Animated3DText 
                    className="text-3d-white relative z-10 block mb-2 md:mb-1"
                    text="PODER &"
                  />
                  <Animated3DText 
                    className="text-3d-gold relative z-20 block"
                    text="INFLUÊNCIA."
                  />
                </motion.h2>
              </motion.div>
              <p className="text-gray-400 text-lg leading-relaxed mb-10">
                Ser uma <strong>Promoter Magnata</strong> não é apenas sobre divulgar um evento, é sobre se posicionar ao lado dos maiores. No <strong>Fraga Lounge</strong>, você terá o tratamento que merece.
              </p>
              <ul className="space-y-6">
                {[
                  "Sorteio de carrinho de R$500 na Shein a cada post.",
                  "Acesso à Área Backstage.",
                  "Networking com empresários da cidade.",
                  "Convites para levar amigos.",
                  "Foto garantida com MC Paiva.",
                  "Vários outros benefícios ao decorrer da divulgação."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-gray-300 font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-900 to-black border-2 border-amber-500/30 group gold-glow shadow-2xl flex items-end justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/20 to-transparent z-10" />
                
                <video 
                  src={nationalVideoUrl || heroVideoUrl || 'https://azlyuniavfnjgutidace.supabase.co/storage/v1/object/public/midia_magnata/hero_video_0.9536983006436293.mp4'}
                  controls
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
              <div className="absolute top-6 left-6 z-20">
                <div className="bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                  Atração Nacional
                </div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 backdrop-blur-md mb-6 border border-amber-500/50 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                  <Play className="w-6 h-6 text-amber-400 ml-1" />
             </div>
                <h3 className="font-display text-5xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-lg">MC Paiva</h3>
                <p className="text-amber-500 font-bold uppercase tracking-widest text-sm drop-shadow-md">+ Line-Up Exclusivo</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Recruitment Process */}
        <section className="max-w-6xl mx-auto mb-32 px-2">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-black uppercase mb-4 tracking-wider">Como Funciona</h2>
            <p className="text-gray-500 text-sm">O caminho para o centro do palco.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
            <div className="hidden md:block absolute top-[40%] left-0 w-full h-[1px] bg-amber-500/10 -z-10" />
            {[
              { step: "01", title: "Cadastro", desc: "Formulário rápido e link do Insta." },
              { step: "02", title: "Análise", desc: "Equipe avalia seu perfil." },
              { step: "03", title: "Aprovação", desc: "Contato direto via WhatsApp." },
              { step: "04", title: "Acesso", desc: "Liberação do portal e material." },
              { step: "05", title: "Show day", desc: "Presença VIP no backstage." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 glass rounded-3xl border-white/5 relative bg-black/40 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center font-black text-black mb-5 shadow-xl shadow-amber-500/20 text-sm">
                  {item.step}
                </div>
                <h4 className="font-black text-white mb-2 uppercase text-[10px] tracking-widest">{item.title}</h4>
                <p className="text-gray-500 text-[9px] leading-relaxed font-bold uppercase tracking-wider">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing/Plans Section */}
        <section id="cadastro" className="max-w-6xl mx-auto mb-32 pt-20">
          <div className="text-center mb-16 flex flex-col items-center">
            <motion.div
              style={{ perspective: 1200 }}
              className="mb-8 z-20"
            >
              <motion.h2
                animate={{ rotateX: [6, -4, 6], rotateY: [-3, 3, -3], y: [-3, 3, -3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="font-display text-4xl md:text-5xl lg:text-7xl font-black uppercase transform-style-3d cursor-default drop-shadow-2xl flex flex-wrap justify-center gap-x-4 lg:gap-x-6"
              >
                <Animated3DText className="text-3d-white" text="NOSSOS" />
                <Animated3DText className="text-3d-gold" text="BENEFÍCIOS" delayOffset={0.5} />
              </motion.h2>
            </motion.div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">Escolha seu nível de engajamento e garanta sua vaga na equipe oficial.</p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <PricingCard 
                name="Promoter Magnata"
                price="Acesso VIP"
                subtitle="Destaque Máximo & Status"
                recommended={true}
                features={[
                  "Sorteio R$500 na Shein a cada post",
                  "Área Backstage & Lounge VIP",
                  "Foto Exclusiva com MC Paiva",
                  "Networking com Empresários",
                  "Convites VIPs p/ seus Amigos",
                  "Diversos outros benefícios",
                  "Comissão Agressiva por Venda"
                ]}
                delay={0}
                onSelect={() => setIsModalOpen(true)}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-6xl mx-auto mb-32 pt-20">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black uppercase mb-4 tracking-wider">Dúvidas Frequentes</h2>
            <p className="text-gray-400">Tudo o que você precisa saber sobre a equipe Magnata.</p>
          </div>
          <FAQSection />
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 md:p-16 rounded-3xl glass border-amber-500/30 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-1/2 -ml-[250px] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[100px] pointer-events-none" />
            
            <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <motion.div
              style={{ perspective: 1200 }}
              className="mb-8 z-20 flex justify-center"
            >
              <motion.h2
                animate={{ rotateX: [4, -4, 4], rotateY: [-2, 2, -2], y: [-2, 2, -2] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="font-display text-4xl md:text-5xl lg:text-5xl font-black tracking-tighter text-white uppercase transform-style-3d cursor-default drop-shadow-2xl"
              >
                <Animated3DText className="text-3d-white" text="SEJA UMA MAGNATA" />
              </motion.h2>
            </motion.div>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Feira de Santana vai parar. Garanta sua vaga no time oficial do <strong className="text-amber-400">Baile do Magnata</strong> e viva essa experiência exclusiva.
            </p>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-3 premium-gradient text-black h-16 md:h-20 rounded-2xl font-black text-sm md:text-lg shadow-2xl active:scale-95 transition-transform w-full sm:w-auto mx-auto group uppercase tracking-[0.2em] font-display cursor-pointer">
              Falar com a Coordenação
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 text-center text-zinc-500 text-sm">
        <p className="font-bold uppercase tracking-widest text-xs mb-2">Coordenação de Promoters - Acelera Produções</p>
        <p>&copy; {new Date().getFullYear()} Baile do Magnata. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function StatsCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass p-8 rounded-3xl flex flex-col items-start gap-4 hover:bg-white/[0.05] transition-colors border-white/10"
    >
      <div className="text-4xl font-black text-amber-500 flex items-center gap-4 font-display">
        <span className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-white">
          {icon}
        </span>
        {value}
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-widest font-bold leading-relaxed">{label}</div>
    </motion.div>
  );
}

function PricingCard({ name, price, subtitle, features, recommended, delay, onSelect }: { name: string, price: string, subtitle: string, features: string[], recommended?: boolean, delay: number, onSelect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative p-8 md:p-10 rounded-3xl flex flex-col glass ${
        recommended 
        ? 'border-amber-500/50 majestic-glow z-10 scale-100 lg:scale-105 bg-black/60' 
        : 'border-white/10 opacity-90 scale-100 lg:scale-95 bg-black/40'
      }`}
    >
      {recommended && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="shimmer-overlay" />
        </div>
      )}
      {recommended && (
        <div className="absolute -top-4 w-full left-0 flex justify-center z-20">
          <div className="premium-gradient px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg text-black font-display">
            Vaga Limitada
          </div>
        </div>
      )}
      
      <div className="mb-8 mt-2">
        <div className="flex justify-between items-center mb-2">
           <h3 className={`font-display font-black uppercase tracking-wider ${recommended ? 'text-4xl text-transparent bg-clip-text text-gradient-gold drop-shadow-md' : 'text-3xl text-white'}`}>{name}</h3>
        </div>
        <p className="text-[10px] text-amber-500/80 uppercase tracking-[0.2em] font-bold mb-4">{subtitle}</p>
        <div className={`text-sm ${recommended ? 'text-white' : 'text-gray-500'} font-bold`}>{price}</div>
      </div>
      
      <div className="flex-1">
        <ul className="space-y-4 mb-10">
          {features.map((feature, i) => (
            <li key={i} className="flex gap-3 text-gray-300 items-start">
              <Star className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${recommended ? 'fill-amber-500 text-amber-500' : 'fill-white/20 text-transparent'}`} />
              <span className="text-xs text-gray-300 font-medium leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onSelect} className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 font-display cursor-pointer ${
        recommended
        ? 'premium-gradient shadow-[0_0_30px_rgba(212,175,55,0.3)] text-black hover:brightness-110'
        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
      }`}>
        {recommended ? 'Preencher Formulário' : 'Analisar Perfil'}
      </button>
    </motion.div>
  );
}
