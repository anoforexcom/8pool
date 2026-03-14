
import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, CheckCircle, Star, ChevronDown, ShieldCheck, Zap, HelpCircle, Menu, X, Trophy, ChevronUp, Quote, Award, Brain, Rocket, Users2, Sparkles, Target, Mail, Phone, Facebook, Twitter, Instagram, Linkedin, CreditCard, ArrowRight, ChevronRight } from 'lucide-react';
import { TOTAL_LEVELS, TESTIMONIALS, CREDIT_PACKS } from '../constants';
import { VisaIcon, MastercardIcon, PayPalIcon, MBWayIcon, MultibancoIcon } from './PaymentIcons';

interface LandingPageProps {
  onStart: (intent?: string) => void;
  onNavigate: (view: any) => void;
  onAdmin: () => void;
  appName: string;
}

const FAQS = [
  { q: "How many tournaments are available?", a: `There are currently ${TOTAL_LEVELS} handcrafted table challenges ranging from Amateur to Professional. We update our tournaments regularly to keep the competition fresh.` },
  { q: "What can I do with my game credits?", a: "Credits can be used for entry fees in high-stakes matches, purchasing premium cues, or activating special 'Precision Aim' for difficult shots." },
  { q: "Is the game free to play?", a: "Yes! You can register for free and start playing immediately. All new accounts receive 50 free credits to get started on their career." },
  { q: "Can I play on multiple devices?", a: "If you create an account, your career progress and credit balance are synced across all devices where you log in with your credentials." },
  { q: "How is my global ranking calculated?", a: "Your ranking is determined by your win/loss ratio, the difficulty of the tournaments you enter, and the total chips earned durante the session." }
];

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigate, onAdmin, appName }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [adminClicks, setAdminClicks] = useState(0);
  const adminTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogoClick = () => {
    if (adminTimerRef.current) clearTimeout(adminTimerRef.current);

    const newClicks = adminClicks + 1;
    setAdminClicks(newClicks);

    if (newClicks >= 6) {
      onAdmin();
      setAdminClicks(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      adminTimerRef.current = setTimeout(() => {
        setAdminClicks(0);
      }, 2000);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="bg-white p-0.5 rounded-lg text-white group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100 flex items-center justify-center">
              <img src="/logo.png" alt="Pool8Live Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800 uppercase">{appName}</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <button onClick={() => onNavigate('ranking')} className="hover:text-indigo-600 transition-colors uppercase flex items-center gap-1"><Award size={14} /> Ranking</button>
            <button onClick={() => onNavigate('reviews')} className="hover:text-indigo-600 transition-colors">REVIEWS</button>
            <a href="/blog" className="hover:text-indigo-600 transition-colors">Blog</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <button onClick={() => onNavigate('support')} className="hover:text-indigo-600 transition-colors uppercase">Support</button>
            <button onClick={() => onStart()} className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95">
              PLAY NOW
            </button>
          </div>

          <button onClick={toggleMobileMenu} className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 shadow-xl animate-in slide-in-from-top duration-300">
            <div className="flex flex-col p-6 gap-6 text-sm font-bold text-slate-600 uppercase tracking-widest">
              <a href="#how-it-works" onClick={toggleMobileMenu} className="hover:text-indigo-600 border-b border-slate-50 pb-2">How It Works</a>
              <button onClick={() => { onNavigate('ranking'); toggleMobileMenu(); }} className="text-left hover:text-indigo-600 border-b border-slate-50 pb-2 uppercase">Global Ranking</button>
              <a href="/blog" onClick={toggleMobileMenu} className="hover:text-indigo-600 border-b border-slate-50 pb-2">Blog</a>
              <a href="#pricing" onClick={toggleMobileMenu} className="hover:text-indigo-600 border-b border-slate-50 pb-2">Pricing</a>
              <button onClick={() => { onNavigate('support'); toggleMobileMenu(); }} className="text-left hover:text-indigo-600 border-b border-slate-50 pb-2 uppercase">Support</button>
              <button onClick={() => { onStart(); toggleMobileMenu(); }} className="bg-indigo-600 text-white py-4 rounded-2xl font-black text-center shadow-lg active:scale-95">
                PLAY NOW
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-indigo-50/50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left relative z-10">
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 blur-[100px] rounded-full"></div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
              Master the cue with <span className="text-indigo-600">Pool8Live</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              The ultimate 8 Ball Pool experience with {TOTAL_LEVELS} challenging tournaments, strategic credit system, and global rankings.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button onClick={() => onStart()} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                START FREE CHALLENGE
              </button>
              <button onClick={() => onNavigate('ranking')} className="px-10 py-5 bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-50 active:scale-95 transition-all w-full sm:w-auto">
                VIEW RANKINGS
              </button>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-8 text-slate-400 font-medium">
              <div className="flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-500" /> Secure Progress</div>
              <div className="flex items-center gap-2"><Zap size={20} className="text-amber-500" /> Professional Cues</div>
              <div className="flex items-center gap-2"><Trophy size={20} className="text-indigo-400" /> {TOTAL_LEVELS} Pro Tournaments</div>
            </div>
          </div>

          <div className="relative z-10 flex justify-center md:justify-end mt-12 md:mt-0">
            <div className="relative w-full max-w-2xl xl:max-w-3xl">
              <div className="absolute inset-0 bg-indigo-600/20 blur-3xl rounded-full transform translate-y-4"></div>
              <img
                src="/hero-bg.png"
                alt="Pool 8 Live App Interface"
                className="relative rounded-3xl shadow-2xl border-[6px] border-white transform rotate-2 hover:rotate-0 transition-transform duration-500 w-full object-cover"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-3xl shadow-xl animate-bounce">
                <div className="flex items-center gap-3">
                  <Star className="text-amber-400 fill-current" size={24} />
                  <span className="font-black text-slate-800 text-lg">Top Rated App</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW PERSUASIVE SECTION 1: Neuro-Fitness */}
      <section className="py-24 px-4 bg-white border-y border-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-16">
          <div className="order-2 md:order-1 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl"></div>
            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-inner relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 transform -rotate-2">
                  <Brain className="text-indigo-600 mb-3" size={28} />
                  <h4 className="font-black text-slate-800 text-sm uppercase">Focus</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Enhance concentration</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 transform rotate-2 translate-y-4">
                  <Target className="text-emerald-500 mb-3" size={28} />
                  <h4 className="font-black text-slate-800 text-sm uppercase">Logic</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Deductive reasoning</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 transform rotate-1 -translate-y-2">
                  <Zap className="text-amber-500 mb-3" size={28} />
                  <h4 className="font-black text-slate-800 text-sm uppercase">Agility</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Mental processing speed</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 transform -rotate-3 translate-y-2">
                  <Sparkles className="text-rose-500 mb-3" size={28} />
                  <h4 className="font-black text-slate-800 text-sm uppercase">Flow</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Stress reduction</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">The Science of Play</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Unlock Your Peak <br /><span className="text-indigo-600">Pool Potential</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Pool8Live isn't just a game—it's a test of precision and strategy. Master the physics of the table, improve your geometric intuition, and build resilient competitive skills for the global arena.
            </p>
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-slate-700 font-bold">
                <CheckCircle className="text-emerald-500" size={20} />
                <span>Master ball physics and spin</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-bold">
                <CheckCircle className="text-emerald-500" size={20} />
                <span>Enter a competitive 'flow' state</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-bold">
                <CheckCircle className="text-emerald-500" size={20} />
                <span>Sharpen your strategic decision making</span>
              </div>
            </div>
            <button onClick={() => onStart()} className="mt-8 flex items-center gap-2 group text-indigo-600 font-black uppercase tracking-widest text-sm">
              Start Your Pro Career <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials (Auto-scroll) */}
      <section id="testimonials" className="py-24 px-4 bg-indigo-600 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-16 uppercase tracking-widest text-indigo-100">What Masters Say</h2>
          <div className="relative h-[300px] md:h-[250px]">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${i === testimonialIndex ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-95 pointer-events-none'
                  }`}
              >
                <div className="bg-indigo-700 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-indigo-500/30 flex flex-col items-center text-center">
                  <Quote size={40} className="text-indigo-300 mb-4" />
                  <p className="text-lg md:text-xl text-indigo-50 italic font-medium mb-6 leading-relaxed max-w-3xl">"{t.text}"</p>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={16} className="text-amber-400 fill-current" />)}
                  </div>
                  <h4 className="font-black text-white uppercase tracking-tight">{t.name}</h4>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === testimonialIndex ? 'bg-white w-8' : 'bg-indigo-800'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-16 uppercase tracking-widest text-slate-800">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Create Your Account", desc: "Register in seconds and receive 50 free credits to start your professional career.", icon: <CheckCircle className="text-indigo-600" size={32} /> },
              { title: "Choose Your Table", desc: `Explore ${TOTAL_LEVELS} hand-crafted tournaments, from Beginner to Pro. Every victory increases your prestige.`, icon: <Trophy className="text-indigo-600" size={32} /> },
              { title: "Use Strategic Boosts", desc: "Need an edge? Use your credits to enter high-stakes matches or buy professional gear.", icon: <Zap className="text-indigo-600" size={32} /> },
            ].map((step, i) => (
              <div key={i} className="group bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-indigo-50 transition-colors">{step.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-slate-800 uppercase tracking-tight">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW PERSUASIVE SECTION 2: Master Community / Final CTA */}
      <section className="py-24 px-4 bg-indigo-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400/20 rounded-full blur-[120px]"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Users2 className="mx-auto mb-8 text-indigo-200" size={64} />
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-none tracking-tighter">
            Join the Elite <span className="text-indigo-200">1% of Masters</span>
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            With {TOTAL_LEVELS} handcrafted tournaments, only the most dedicated players reach the final table. Are you ready to prove your skill and climb the global leaderboard?
          </p>

          <div className="bg-white/10 backdrop-blur-md p-1 rounded-3xl inline-flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button onClick={() => onStart()} className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xl hover:bg-indigo-50 active:scale-95 transition-all flex items-center justify-center gap-3">
              <Rocket size={24} /> REGISTER & START NOW
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-12 gap-y-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-white">Novo</span>
              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Lançamento</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-white">{TOTAL_LEVELS}</span>
              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Puzzles Reais</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-white">24/7</span>
              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Suporte Global</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-16 uppercase tracking-widest text-slate-800 font-sans">Common Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-black text-slate-700 uppercase tracking-tight text-sm md:text-base">{faq.q}</span>
                  {activeFaq === i ? <ChevronUp className="text-indigo-600" /> : <ChevronDown className="text-slate-300" />}
                </button>
                <div className={`transition-all duration-300 ease-in-out ${activeFaq === i ? 'max-h-40 p-6 pt-0 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-slate-900 text-white rounded-[4rem] mx-4 shadow-2xl">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">GAME CREDITS</h2>
          <p className="text-slate-400 mb-16 max-w-lg mx-auto font-medium">Get the chips you need to enter high-stakes tournaments and dominate the field.</p>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {CREDIT_PACKS.map((p, i) => (
              <div key={i} className={`flex flex-col p-10 rounded-[2.5rem] border-2 transition-transform hover:-translate-y-2 ${p.active ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/50'} relative`}>
                {p.active && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-[10px] font-black px-6 py-1 rounded-full uppercase tracking-widest">MOST POPULAR</span>}
                <div className="flex-1">
                  <h4 className="font-bold text-slate-500 mb-4 tracking-widest text-xs uppercase">{p.pack}</h4>
                  <div className="text-5xl font-black mb-2">{p.qty} Credits</div>
                  <div className="text-2xl font-bold text-indigo-400 mb-10">{p.amount}</div>
                  <ul className="text-sm text-slate-400 mb-10 space-y-4 text-left font-medium">
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-400" /> {p.bonus}</li>
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-400" /> Use in any tournament</li>
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-400" /> Instant Activation</li>
                  </ul>
                </div>
                <button onClick={() => onStart(p.id)} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-200 active:scale-95 transition-all uppercase tracking-widest text-xs">BUY NOW</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-4 bg-white border-t border-slate-100 mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white p-0.5 rounded-lg text-white shadow-sm overflow-hidden border border-slate-100 flex items-center justify-center">
                <img src="/logo.png" alt="Pool8Live Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="font-black text-2xl text-slate-800 tracking-tighter">{appName} PRO</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
              The world's number one Pool community. Developing precision and strategy with style, one match at a time.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-black mb-6 uppercase text-xs tracking-widest text-slate-400">Contact Us</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-indigo-600" />
                <a href="mailto:support@pool8.live" className="hover:text-indigo-600 transition-colors">support@pool8.live</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-indigo-600" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 group cursor-pointer hover:text-indigo-600 transition-colors">
                <ChevronRight size={14} className="text-indigo-500 group-hover:translate-x-1 transition-transform" />
                <a href="/blog">Blog & News</a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-black mb-6 uppercase text-xs tracking-widest text-slate-400">Legal</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-600 uppercase tracking-widest">
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-indigo-600 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-indigo-600 transition-colors">Terms of Use</button></li>
              <li><button onClick={() => onNavigate('support')} className="hover:text-indigo-600 transition-colors">Support / FAQ</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black mb-6 uppercase text-xs tracking-widest text-slate-400">Secure Payment</h5>
            <div className="flex flex-wrap gap-3">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-center transition-all hover:bg-white hover:shadow-md cursor-default">
                <VisaIcon size={32} />
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-center transition-all hover:bg-white hover:shadow-md cursor-default">
                <MastercardIcon size={32} />
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-center transition-all hover:bg-white hover:shadow-md cursor-default">
                <PayPalIcon size={32} />
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-center transition-all hover:bg-white hover:shadow-md cursor-default">
                <MBWayIcon size={32} />
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-center transition-all hover:bg-white hover:shadow-md cursor-default">
                <MultibancoIcon size={32} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-24 pt-8 border-t border-slate-50 text-center text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">
          © 2026 POOL8.LIVE. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};


export default LandingPage;
