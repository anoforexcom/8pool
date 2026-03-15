import React, { useState } from 'react';
import { Share2, Copy, Gift, Trophy, Users, ArrowLeft, Check, LayoutGrid } from 'lucide-react';
import { UserProfile } from '../types';
import { getReferralLink, SHARE_MESSAGES, REFERRAL_MILESTONES } from '../utils/referralUtils';

interface ReferralPageProps {
    user: UserProfile;
    onBack: () => void;
}

const ReferralPage: React.FC<ReferralPageProps> = ({ user, onBack }) => {
    const [copied, setCopied] = useState(false);

    const referralCode = user.referralCode || '';
    const referralLink = getReferralLink(referralCode);
    const referralData = user.referralData || {
        code: referralCode,
        userId: user.email,
        createdAt: Date.now(),
        totalReferred: 0,
        totalEarned: 0,
        referredUsers: []
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareWhatsApp = () => {
        const message = encodeURIComponent(SHARE_MESSAGES.whatsapp(referralLink));
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };

    const shareFacebook = () => {
        const url = encodeURIComponent(referralLink);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    };

    const shareTwitter = () => {
        const text = encodeURIComponent(SHARE_MESSAGES.twitter(referralLink));
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    };

    const shareEmail = () => {
        const emailData = SHARE_MESSAGES.email(referralLink);
        const subject = encodeURIComponent(emailData.subject);
        const body = encodeURIComponent(emailData.body);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const nextMilestone = REFERRAL_MILESTONES.find(
        m => m.friends > referralData.totalReferred
    );

    const progress = nextMilestone
        ? (referralData.totalReferred / nextMilestone.friends) * 100
        : 100;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-white p-0.5 rounded-lg text-white shadow-sm overflow-hidden border border-slate-100 flex items-center justify-center">
                            <img src="/logo.png" alt="Pool8Live Logo" className="w-6 h-6 object-contain" />
                        </div>
                        <span className="font-black text-xl tracking-tight text-slate-800 uppercase">POOL8.LIVE</span>
                    </div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 uppercase tracking-widest transition-colors"
                    >
                        <ArrowLeft size={16} /> Voltar
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 pt-24 space-y-8">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Gift size={32} />
                        <h1 className="text-3xl font-black uppercase tracking-tight">Programa de Referência</h1>
                    </div>
                    <p className="text-lg opacity-90">
                        Convida amigos e ganha créditos ilimitados!
                    </p>
                </div>

                {/* Referral Link */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-black mb-4 uppercase tracking-tight">Teu Link Único</h2>
                    <div className="flex gap-3 mb-6">
                        <input
                            type="text"
                            value={referralLink}
                            readOnly
                            className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-sm"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 flex items-center gap-2 transition-all active:scale-95"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>

                    {/* Share Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                            onClick={shareWhatsApp}
                            className="py-3 bg-green-500 text-white rounded-xl font-black hover:bg-green-600 transition-all active:scale-95"
                        >
                            💬 WhatsApp
                        </button>
                        <button
                            onClick={shareFacebook}
                            className="py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all active:scale-95"
                        >
                            📘 Facebook
                        </button>
                        <button
                            onClick={shareTwitter}
                            className="py-3 bg-sky-500 text-white rounded-xl font-black hover:bg-sky-600 transition-all active:scale-95"
                        >
                            🐦 Twitter
                        </button>
                        <button
                            onClick={shareEmail}
                            className="py-3 bg-slate-600 text-white rounded-xl font-black hover:bg-slate-700 transition-all active:scale-95"
                        >
                            📧 Email
                        </button>
                    </div>
                </div>

                {/* How It Works */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-black mb-6 uppercase tracking-tight">Como Funciona</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { step: '1', icon: '🔗', title: 'Partilha', desc: 'Envia o teu link único' },
                            { step: '2', icon: '✅', title: 'Registo', desc: 'Amigo regista-se (+50💎)' },
                            { step: '3', icon: '🎮', title: 'Joga', desc: 'Completa 1º nível (+50💎)' },
                            { step: '4', icon: '💰', title: 'Compra', desc: 'Faz compra (+200💎)' }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl mb-2">{item.icon}</div>
                                <div className="font-black text-sm uppercase mb-1">{item.title}</div>
                                <div className="text-xs text-slate-500">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center shadow-sm">
                        <Users size={32} className="mx-auto mb-2 text-emerald-600" />
                        <div className="text-3xl font-black">{referralData.totalReferred}</div>
                        <div className="text-sm text-slate-500 uppercase tracking-widest">Amigos</div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center shadow-sm">
                        <Gift size={32} className="mx-auto mb-2 text-emerald-600" />
                        <div className="text-3xl font-black">{referralData.totalEarned}💎</div>
                        <div className="text-sm text-slate-500 uppercase tracking-widest">Ganhos</div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center shadow-sm">
                        <Trophy size={32} className="mx-auto mb-2 text-amber-600" />
                        <div className="text-3xl font-black">{user.referralMilestones?.length || 0}</div>
                        <div className="text-sm text-slate-500 uppercase tracking-widest">Badges</div>
                    </div>
                </div>

                {/* Next Milestone */}
                {nextMilestone && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-black uppercase tracking-tight">Próximo Milestone</h3>
                            <span className="text-2xl font-black text-amber-600">
                                +{nextMilestone.bonus}💎
                            </span>
                        </div>
                        <div className="mb-2 text-sm font-bold text-slate-600">
                            {referralData.totalReferred} / {nextMilestone.friends} amigos
                        </div>
                        <div className="h-4 bg-white rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                            Faltam {nextMilestone.friends - referralData.totalReferred} amigos para {nextMilestone.badge}
                        </div>
                    </div>
                )}

                {/* Referred Users List */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-black mb-6 uppercase tracking-tight">Amigos Convidados</h2>
                    {referralData.referredUsers.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <Users size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="font-bold">Ainda não convidaste ninguém</p>
                            <p className="text-sm">Partilha o teu link para começar!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {referralData.referredUsers.map((friend, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-black text-emerald-600">
                                            {friend.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-black">{friend.name}</div>
                                            <div className="text-xs text-slate-500">
                                                {friend.status === 'purchased' && '✅ Comprou'}
                                                {friend.status === 'played' && '✅ Jogou'}
                                                {friend.status === 'signed_up' && '⏳ Registado'}
                                                {friend.status === 'pending' && '⏳ Pendente'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-black text-emerald-600">
                                        +{friend.creditsEarned}💎
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Milestones List */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-black mb-6 uppercase tracking-tight">Milestones Disponíveis</h2>
                    <div className="space-y-3">
                        {REFERRAL_MILESTONES.map((milestone, i) => {
                            const isUnlocked = user.referralMilestones?.includes(milestone.badge);
                            const isCurrent = nextMilestone?.badge === milestone.badge;

                            return (
                                <div
                                    key={i}
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isUnlocked
                                        ? 'bg-emerald-50 border-emerald-200'
                                        : isCurrent
                                            ? 'bg-amber-50 border-amber-200'
                                            : 'bg-slate-50 border-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                                            {i === 0 && '🥉'}
                                            {i === 1 && '🥈'}
                                            {i === 2 && '🥇'}
                                            {i === 3 && '💎'}
                                            {i === 4 && '👑'}
                                        </div>
                                        <div>
                                            <div className="font-black">{milestone.badge}</div>
                                            <div className="text-xs text-slate-500">{milestone.friends} amigos</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-amber-600">+{milestone.bonus}💎</span>
                                        {isUnlocked && <Check size={20} className="text-emerald-600" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferralPage;
