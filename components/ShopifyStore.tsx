
import React, { useState, useEffect } from 'react';
import { ShoppingBag, CreditCard, X, ChevronRight, Package, Loader2 } from 'lucide-react';

interface ShopifyProduct {
    id: string;
    title: string;
    description: string;
    price: string;
    currencyCode: string;
    credits: number;
}

interface ShopifyStoreProps {
    onClose: () => void;
    onPurchaseSuccess: (credits: number) => void;
}

const ShopifyStore: React.FC<ShopifyStoreProps> = ({ onClose, onPurchaseSuccess }) => {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated Shopify Storefront API Fetch
        const fetchShopifyProducts = async () => {
            setLoading(true);
            try {
                // In a real implementation, you would use:
                // fetch('https://YOUR_STORE.myshopify.com/api/2023-01/graphql.json', ...)

                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockProducts: ShopifyProduct[] = [
                    { id: '1', title: 'Starter Pack', description: 'Beginner tournament entry', price: '4.99', currencyCode: 'USD', credits: 100 },
                    { id: '2', title: 'Pro Pack', description: 'Includes custom cues', price: '9.99', currencyCode: 'USD', credits: 250 },
                    { id: '3', title: 'Elite Pack', description: 'Best value for professionals', price: '19.99', currencyCode: 'USD', credits: 600 },
                    { id: '4', title: 'Master Pack', description: 'Unlock all cues + Bonus', price: '49.99', currencyCode: 'USD', credits: 2000 },
                ];
                setProducts(mockProducts);
            } catch (error) {
                console.error("Shopify fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShopifyProducts();
    }, []);

    const handleCheckout = (product: ShopifyProduct) => {
        // Shopify Checkout Logic:
        // 1. Create Checkout via Shopify Storefront API
        // 2. Redirect user to: https://YOUR_STORE.myshopify.com/checkouts/...
        // 3. Shopify notifies our Backend (Vercel) via Webhook 'orders/paid'
        // 4. Backend updates Firebase with new Credits

        console.log(`Redirecting to Shopify Checkout for ${product.title}...`);
        setLoading(true);

        // Simulating the redirect and back transition
        setTimeout(() => {
            alert(`Saindo para o Checkout Seguro do Shopify...\n\nAo finalizar o pagamento de ${product.price} ${product.currencyCode}, seus créditos de ${product.credits} serão adicionados automaticamente via Webhook.`);
            onPurchaseSuccess(product.credits);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
                <header className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
                    <div className="flex items-center gap-4">
                        <ShoppingBag size={32} className="text-amber-400" />
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Pro Shop</h2>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-80">Powered by Shopify</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all border border-white/20">
                        <X size={24} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-10 bg-slate-50">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                            <Loader2 className="animate-spin" size={48} />
                            <p className="font-black uppercase tracking-widest text-sm">Escaneando produtos...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <Package size={32} />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-slate-900">{product.price} {product.currencyCode}</div>
                                            <div className="text-indigo-600 font-black text-xs uppercase tracking-widest">{product.credits} Credits</div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">{product.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium mb-6">{product.description}</p>

                                    <button
                                        onClick={() => handleCheckout(product)}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95"
                                    >
                                        BUY NOW <ChevronRight size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <footer className="p-6 bg-white border-t border-slate-100 text-center">
                    <div className="flex items-center justify-center gap-6 opacity-30">
                        <div className="flex items-center gap-2 font-black text-[10px]"><CreditCard size={14} /> SECURE CHECKOUT</div>
                        <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                        <div className="font-black text-[10px] tracking-widest">WORLDWIDE DELIVERY</div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ShopifyStore;
