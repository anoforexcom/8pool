
import React from 'react';
import { X, CheckCircle, ShoppingCart } from 'lucide-react';
import { CREDIT_PACKS } from '../constants';
import { CreditPack } from '../types';

interface PurchaseModalProps {
    onClose: () => void;
    onSelectPack: (pack: CreditPack) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ onClose, onSelectPack }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">

                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
                            <ShoppingCart size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">Store</h2>
                            <p className="text-xs text-slate-500 font-bold">Secure checkout</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-10 overflow-y-auto bg-slate-50">
                    <div className="grid md:grid-cols-3 gap-6">
                        {CREDIT_PACKS.map((p) => (
                            <div key={p.id} className={`bg-white rounded-3xl p-6 border-2 relative flex flex-col ${p.active ? 'border-indigo-500 shadow-xl shadow-indigo-500/20 scale-[1.02]' : 'border-slate-200 shadow-sm hover:border-indigo-300'} transition-all`}>
                                {p.active && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">Best Value</div>}

                                <div className="text-center mb-6 pt-2">
                                    <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-2">{p.pack}</h3>
                                    <div className="text-4xl font-black text-slate-800 mb-1">{p.qty}</div>
                                    <div className="text-xs font-black text-indigo-500 uppercase tracking-wide">Credits</div>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                        <CheckCircle size={14} className="text-emerald-500" /> {p.bonus}
                                    </li>
                                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                        <CheckCircle size={14} className="text-emerald-500" /> Instant Delivery
                                    </li>
                                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                        <CheckCircle size={14} className="text-emerald-500" /> No Expiration
                                    </li>
                                </ul>

                                <button
                                    onClick={() => onSelectPack(p)}
                                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${p.active ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/40' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                >
                                    Buy for {p.amount}
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8">
                        Payments processed securely. No refund on digital goods.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PurchaseModal;
