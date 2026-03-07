import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show prompt after 30 seconds
            setTimeout(() => {
                setShowPrompt(true);
            }, 30000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if app was installed
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowPrompt(false);
        }

        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Don't show again for 7 days
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    // Don't show if installed or dismissed recently
    if (isInstalled || !showPrompt || !deferredPrompt) return null;

    if (typeof window !== 'undefined') {
        const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissedTime) {
            const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < 7) return null;
        }
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[200] animate-in slide-in-from-bottom duration-500">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 rounded-2xl">
                        <Download size={24} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black text-lg uppercase tracking-tight mb-1">
                            Instala a App!
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Joga offline e acede mais rápido ao sudokas.live
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleInstall}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm uppercase hover:bg-indigo-700 transition-all active:scale-95"
                            >
                                Instalar
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-sm uppercase hover:bg-slate-200 transition-all"
                            >
                                Agora Não
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>✓ Acesso offline</span>
                        <span>•</span>
                        <span>✓ Mais rápido</span>
                        <span>•</span>
                        <span>✓ Ícone no ecrã</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
