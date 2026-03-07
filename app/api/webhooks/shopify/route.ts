import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '../../../../services/firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';

// O segredo do webhook do Shopify deve estar nas env vars
const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-shopify-hmac-sha256');

        // 1. Verificar a assinatura do Shopify (Segurança)
        if (SHOPIFY_WEBHOOK_SECRET) {
            const hash = crypto
                .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
                .update(body)
                .digest('base64');

            if (hash !== signature) {
                return new NextResponse('Invalid signature', { status: 401 });
            }
        }

        const data = JSON.parse(body);
        const email = data.customer?.email;
        const lineItems = data.line_items || [];

        if (!email) {
            return new NextResponse('No customer email found', { status: 400 });
        }

        // 2. Calcular créditos baseados nos line_items
        // Exemplo: identificar o SKU ou o título do produto
        let totalCreditsToAdd = 0;

        lineItems.forEach((item: any) => {
            // Lógica customizada baseada no nome do produto no Shopify
            if (item.title.toLowerCase().includes('500 credits')) totalCreditsToAdd += 500;
            else if (item.title.toLowerCase().includes('1200 credits')) totalCreditsToAdd += 1200;
            else if (item.title.toLowerCase().includes('2500 credits')) totalCreditsToAdd += 2500;
            else if (item.title.toLowerCase().includes('6000 credits')) totalCreditsToAdd += 6000;
            else if (item.title.toLowerCase().includes('15000 credits')) totalCreditsToAdd += 15000;
        });

        if (totalCreditsToAdd > 0) {
            // 3. Atualizar Firebase
            // Nota: Precisamos de uma forma de mapear email para userID se o ID não for o email
            const userRef = doc(db, 'users', email);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                await updateDoc(userRef, {
                    credits: increment(totalCreditsToAdd),
                    lastPurchaseAt: Date.now(),
                    totalPurchased: increment(data.total_price)
                });

                console.log(`Sucesso: Adicionados ${totalCreditsToAdd} créditos a ${email}`);
            }
        }

        return new NextResponse('OK', { status: 200 });
    } catch (err) {
        console.error('Webhook Error:', err);
        return new NextResponse('Webhook error', { status: 500 });
    }
}
