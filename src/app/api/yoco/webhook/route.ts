// src/app/api/yoco/webhook/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Tipe-definisie vir die Yoco Webhook-data
type YocoWebhookPayload = {
  id: string; // Die Yoco Charge ID
  type: 'charge.succeeded' | 'charge.failed';
  data: {
    id: string; // Weereens die Charge ID
    live_mode: boolean;
    amount: number;
    currency: string;
    status: 'succeeded' | 'failed' | 'pending';
    metadata: {
      order_id?: string; // Ons interne UUID
      order_ref?: string; // Ons human_readable_id
    };
    // ...daar is nog baie ander velde, maar ons het net hierdie nodig
  };
};

/**
 * Hierdie is die webhook-eindpunt wat Yoco sal roep na 'n betaling.
 * Dit gebruik die 'service_role' sleutel om Supabase op te dateer.
 */
export async function POST(request: Request) {
  const yocoWebhookSecret = process.env.YOCO_WEBHOOK;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!yocoWebhookSecret || !supabaseServiceKey || !supabaseUrl) {
    console.error("Webhook Fout: Omgewingsveranderlikes (YOCO_WEBHOOK, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL) is nie opgestel nie.");
    return NextResponse.json({ error: 'Interne bedienerfout' }, { status: 500 });
  }

  // Skep 'n eenmalige Supabase "admin" kliënt
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody) as YocoWebhookPayload;
    
    // --- 1. Valideer die Yoco Handtekening ---
    const yocoSignature = request.headers.get('yoco-signature');
    if (!yocoSignature) {
      console.warn("Webhook Verwerp: Geen 'yoco-signature' in header.");
      return NextResponse.json({ error: 'Handtekening (signature) word vermis' }, { status: 400 });
    }

    const hmac = crypto.createHmac('sha256', yocoWebhookSecret);
    const computedSignature = hmac.update(rawBody).digest('hex');

    if (computedSignature !== yocoSignature) {
      console.warn("Webhook Verwerp: Handtekeninge stem nie ooreen nie.");
      return NextResponse.json({ error: 'Ongeldige handtekening' }, { status: 401 });
    }
    console.log("Webhook-handtekening suksesvol geverifieer.");

    // --- 2. Verwerk die Gebeurtenis ---
    const { id: yocoChargeId, data, type } = payload;
    const orderId = data.metadata?.order_id; // Ons interne UUID

    if (!orderId) {
      console.error(`Webhook Fout: 'order_id' word vermis in Yoco metadata vir charge ${yocoChargeId}`);
      // Ons stuur 200, want die webhook is geldig, maar ons kan dit nie verwerk nie.
      return NextResponse.json({ success: true, message: "Gebeurtenis ontvang, maar geen order_id in metadata." });
    }

    // --- 3. Dateer ons Databasis op ---
    if (type === 'charge.succeeded' && data.status === 'succeeded') {
      console.log(`Betaling Suksesvol vir Order ${orderId} (Yoco ID: ${yocoChargeId}). Dateer databasis op...`);

      const { error: updateError } = await supabaseAdmin
        .from('shop_orders')
        .update({
          status: 'processing', //
          yoco_charge_id: yocoChargeId // Maak seker die ID is gestoor
        })
        .eq('id', orderId)
        .eq('status', 'pending_payment'); // Belangrik! Dateer slegs op as dit nog hangende is.

      if (updateError) {
        console.error(`Webhook DB Fout: Kon nie status opdateer vir Order ${orderId}:`, updateError.message);
        return NextResponse.json({ error: `Databasis-fout: ${updateError.message}` }, { status: 500 });
      }
      
      console.log(`Order ${orderId} suksesvol opgedateer na 'processing'.`);
      
      // TODO: Hanteer die stuur van die "Bestelling Bevestig" e-pos hier.

    } else if (type === 'charge.failed') {
      console.log(`Betaling Misluk vir Order ${orderId} (Yoco ID: ${yocoChargeId}). Dateer databasis op...`);
      
      await supabaseAdmin
        .from('shop_orders')
        .update({ status: 'failed', admin_notes: `Yoco betaling het misluk (Charge ID: ${yocoChargeId})` })
        .eq('id', orderId);
        
    } else {
      console.log(`Webhook ontvang vir onverwagte tipe: ${type}. Word geïgnoreer.`);
    }

    // --- 4. Stuur 200 OK terug na Yoco ---
    return NextResponse.json({ success: true, message: "Webhook ontvang en verwerk." });

  } catch (err: any) {
    console.error("Algehele Webhook Fout:", err.message);
    return NextResponse.json({ error: `Fout met verwerking: ${err.message}` }, { status: 400 });
  }
}