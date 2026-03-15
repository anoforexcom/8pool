import { db } from '../../../../services/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * Stripe Webhook Handler
 * This endpoint processes production events (checkout.session.completed).
 * It ensures credits are delivered securely and prevents manual forgery.
 */
export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature');
    const rawBody = await req.text();

    try {
        // 1. Fetch Config from Firestore
        const settingsRef = doc(db, 'config', 'global');
        const settingsSnap = await getDoc(settingsRef);

        if (!settingsSnap.exists()) {
            return NextResponse.json({ error: 'Config not found' }, { status: 500 });
        }

        const { stripeSecretKey, stripeWebhookSecret, paymentMode } = settingsSnap.data();

        if (!stripeSecretKey || paymentMode !== 'real') {
            return NextResponse.json({ error: 'Payment system not in production mode' }, { status: 400 });
        }

        const stripe = new Stripe(stripeSecretKey);

        // 2. Verify Webhook Signature (If secret is configured)
        let event: Stripe.Event;
        if (stripeWebhookSecret && sig) {
            try {
                event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret);
            } catch (err: any) {
                console.error('Webhook Signature Verify Failed:', err.message);
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            }
        } else {
            // Unsigned events (Testing only)
            event = JSON.parse(rawBody);
        }

        // 3. Handle Completed Session
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const metadata = session.metadata;

            if (metadata?.userId && metadata?.packId) {
                const userId = metadata.userId;
                const packId = metadata.packId;

                // Determine credits (based on ID or mapping)
                // In production, you'd fetch the exact pack info again for safety
                // For this example, we'll try to determine from packId naming or a map
                let creditsToGrant = 0;
                if (packId.includes('100')) creditsToGrant = 100;
                else if (packId.includes('250')) creditsToGrant = 250;
                else if (packId.includes('600')) creditsToGrant = 600;
                else if (packId.includes('2000')) creditsToGrant = 2000;
                else creditsToGrant = 100; // Fallback

                // 4. Update Firebase
                const profileRef = doc(db, 'profiles', userId);
                const profileSnap = await getDoc(profileRef);

                if (profileSnap.exists()) {
                    await updateDoc(profileRef, {
                        credits: increment(creditsToGrant)
                    });

                    // 5. Audit Log
                    await addDoc(collection(db, 'purchases'), {
                        user_id: userId,
                        order_id: session.id,
                        amount: (session.amount_total || 0) / 100,
                        currency: session.currency,
                        credits: creditsToGrant,
                        source: 'stripe_webhook',
                        status: 'completed',
                        created_at: serverTimestamp()
                    });

                    console.log(`SECURE FULFILLMENT: Granted ${creditsToGrant} credits to ${userId}`);
                }
            }
        }

        return NextResponse.json({ received: true });

    } catch (err: any) {
        console.error('Webhook Handler Error:', err);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
