
import Stripe from 'stripe';
import { db } from '../../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { packId, packName, price, successUrl, cancelUrl } = await request.json();

        // 1. Fetch Stripe Secret Key from Firestore (Securely on the server)
        const settingsRef = doc(db, 'config', 'global');
        const settingsSnap = await getDoc(settingsRef);

        if (!settingsSnap.exists()) {
            return new Response(JSON.stringify({ error: 'Configuração não encontrada.' }), { status: 400 });
        }

        const { stripeSecretKey, paymentMode, appName } = settingsSnap.data();

        if (paymentMode !== 'real' || !stripeSecretKey) {
            return new Response(JSON.stringify({ error: 'Pagamentos reais não estão ativos.' }), { status: 400 });
        }

        // 2. Initialize Stripe
        const stripe = new Stripe(stripeSecretKey);

        // 3. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `${appName || 'Sudokas'} - ${packName}`,
                            description: `Compra de ${packName}.`,
                        },
                        unit_amount: Math.round(price * 100), // Stripe uses cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                packId: packId,
            }
        });

        return new Response(JSON.stringify({ id: session.id }), { status: 200 });
    } catch (err: any) {
        console.error('Stripe Error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
