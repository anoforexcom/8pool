
import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, HelpCircle, Send, CheckCircle2 } from 'lucide-react';
import { TOTAL_LEVELS } from '../constants';

interface PolicyProps {
  type: 'privacy' | 'terms' | 'support';
  onBack: () => void;
}

const PolicyPages: React.FC<PolicyProps> = ({ type, onBack }) => {
  const [sent, setSent] = useState(false);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-12 flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs hover:gap-3 transition-all">
          <ArrowLeft size={16} /> BACK TO HOME
        </button>

        {type === 'privacy' && (
          <article className="bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-5xl font-black mb-8 uppercase tracking-tighter text-slate-900">Privacy Policy</h1>
            <p className="font-bold text-slate-400 mb-12 uppercase tracking-widest text-xs">Last Updated: October 24, 2024</p>
            <div className="space-y-12 text-slate-500 leading-relaxed font-medium">
              <section>
                <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tight">1. Data Collection</h3>
                <p>At sudokas.live, your privacy is our priority. We collect only the information necessary for your gaming experience: Username, Email, and level progress.</p>
              </section>
              <section>
                <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tight">2. Credit Transactions</h3>
                <p>All credit purchases are processed by secure external partners. We never store credit card information on our servers.</p>
              </section>
              <section>
                <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tight">3. Cookies and Preferences</h3>
                <p>We use cookies only to keep your session active and store your visual preferences (e.g., notes mode status and audio settings).</p>
              </section>
              <section>
                <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tight">4. User Rights</h3>
                <p>You can request the permanent deletion of your account and all associated data at any time through our support center.</p>
              </section>
            </div>
          </article>
        )}

        {type === 'terms' && (
          <article className="bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-5xl font-black mb-8 uppercase tracking-tighter text-slate-900">Terms of Use</h1>
            <p className="font-bold text-slate-400 mb-12 uppercase tracking-widest text-xs">SudokasLive Community Rules</p>
            <div className="space-y-12 text-slate-500 leading-relaxed font-medium">
              <section>
                <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tight">1. License of Use</h3>
                <p>We grant you a personal, non-transferable license to play and complete the {TOTAL_LEVELS} difficulty levels available on the platform for recreational purposes.</p>
              </section>
              <section>
                <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tight">2. Virtual Credits</h3>
                <p>Credits are a virtual currency with no monetary value outside of the game. They are non-refundable once used for hints, time extensions, or other tactical benefits.</p>
              </section>
              <section>
                <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tight">3. Player Conduct</h3>
                <p>The use of automation software (bots) to solve grids and artificially climb the global ranking is strictly prohibited and will result in a permanent ban.</p>
              </section>
              <section>
                <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tight">4. Limitation of Liability</h3>
                <p>sudokas.live is not responsible for progress loss resulting from technical issues on user devices or internet connection failures.</p>
              </section>
            </div>
          </article>
        )}

        {type === 'support' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-lg">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Master Support</h1>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">We are here to help you on your journey</p>
                </div>
              </div>

              {sent ? (
                <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-300">
                  <div className="bg-emerald-100 text-emerald-600 p-6 rounded-full mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Message Sent!</h3>
                  <p className="text-slate-500 font-medium max-w-sm">Our support team will respond to your email within the next 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSupportSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                      <input required type="text" placeholder="e.g. Master John" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                      <input required type="email" placeholder="master@email.com" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                    <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold">
                      <option>Credit Issues</option>
                      <option>Technical Game Error</option>
                      <option>Level Suggestion</option>
                      <option>Other Matters</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                    <textarea required rows={5} placeholder="Describe in detail how we can help you..." className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-bold resize-none"></textarea>
                  </div>
                  <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
                    SEND MESSAGE <Send size={20} />
                  </button>
                </form>
              )}
            </div>

            <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-10">
                <HelpCircle className="text-indigo-600" size={24} />
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-8">
                <div>
                  <h4 className="font-black text-slate-800 mb-2 uppercase text-sm tracking-tight">How do I earn credits?</h4>
                  <p className="text-slate-500 font-medium">Earn credits by completing levels for the first time or through direct store purchases. All new players start with 50 credits.</p>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 mb-2 uppercase text-sm tracking-tight">Do my credits expire?</h4>
                  <p className="text-slate-500 font-medium">No. Once acquired, credits stay in your account permanently until used for hints or time extensions.</p>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 mb-2 uppercase text-sm tracking-tight">Can I play offline?</h4>
                  <p className="text-slate-500 font-medium">Yes, but credit purchases and global ranking synchronization require an active internet connection.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyPages;
