// src/app/api/yoco/create-checkout/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { CartItem } from '@/context/CartContext'; //

// Tipe vir die inkomende data van die kliënt se 'fetch'
type CheckoutPayload = {
  cartItems: CartItem[];
  cartTotal: number;
  userId: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  shipping_address_line1: string;
  shipping_address_line2: string;
  shipping_city: string;
  shipping_province: string;
  shipping_code: string;
};

export async function POST(request: Request) {
  const { 
    cartItems, 
    cartTotal, 
    userId, 
    ...clientData 
  } = (await request.json()) as CheckoutPayload;

  // Haal al ons geheime sleutels en URL's
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const yocoSecretKey = process.env.YOCO_SECRET_KEY;
  const host = request.headers.get('host') || '';
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;

  if (!supabaseUrl || !supabaseServiceKey || !yocoSecretKey) {
    console.error("API Fout: Nodige sleutels is nie opgestel nie.");
    return NextResponse.json({ error: 'Interne bedienerfout' }, { status: 500 });
  }

  // Gebruik die Admin-kliënt om RLS-beleide te omseil (vir gaste en DB-skryf)
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  let orderId: string | null = null;
  const totalAmountInCents = Math.round(cartTotal * 100);

  if (!cartItems || cartItems.length === 0 || totalAmountInCents <= 0) {
    return NextResponse.json({ error: 'Mandjie is leeg of ongeldig' }, { status: 400 });
  }

  try {
    // --- 1. Skep `shop_orders` Rekord ---
    console.log("API: Skep `shop_orders` rekord...");
    const orderData = {
      user_id: userId || null,
      guest_name: userId ? null : clientData.guest_name,
      guest_email: userId ? null : clientData.guest_email,
      guest_phone: userId ? null : clientData.guest_phone,
      shipping_address_line1: clientData.shipping_address_line1,
      shipping_address_line2: clientData.shipping_address_line2,
      shipping_city: clientData.shipping_city,
      shipping_province: clientData.shipping_province,
      shipping_code: clientData.shipping_code,
      status: 'pending_payment',
      total_amount: cartTotal,
    };

    const { data: order, error: orderError } = await supabaseAdmin
      .from('shop_orders')
      .insert(orderData)
      .select('id, human_readable_id')
      .single();

    if (orderError) throw new Error(`Databasis-fout (Order): ${orderError.message}`);
    if (!order) throw new Error("Kon nie bestelling-ID kry nie.");

    orderId = order.id;
    const humanReadableId = order.human_readable_id || (orderId?.substring(0, 8) || 'IDFOut');
    console.log(`API: Bestelling ${humanReadableId} (${orderId}) geskep.`);

    // --- 2. Skep `shop_order_items` Rekords ---
    console.log("API: Skep `shop_order_items` rekords...");
    const orderItemsData = cartItems.map(item => ({
      order_id: orderId,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
      selected_options: null,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('shop_order_items')
      .insert(orderItemsData);
    
    if (itemsError) throw new Error(`Databasis-fout (Items): ${itemsError.message}`);

    // --- 3. Roep Yoco API (Jou 'route.ts' metode) ---
    console.log(`API: Inisieer Yoco Checkout vir ${totalAmountInCents} sent...`);

    const yocoPayload = {
      amount: totalAmountInCents,
      currency: 'ZAR',
      successUrl: `${baseUrl}/winkel/bestelling/sukses?order_id=${orderId}`,
      cancelUrl: `${baseUrl}/winkel/bestelling/misluk?order_id=${orderId}`,
      failureUrl: `${baseUrl}/winkel/bestelling/misluk?order_id=${orderId}`,
      metadata: {
        order_id: orderId, // <-- Ons interne bestelling-ID
        order_ref: humanReadableId,
      },
    };
    
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yocoSecretKey}`,
      },
      body: JSON.stringify(yocoPayload),
    });

    const yocoData = await response.json();

    if (!response.ok) {
      console.error('Yoco API fout:', yocoData);
      throw new Error(yocoData.message || 'Kon nie Yoco checkout skep nie');
    }

    if (!yocoData.id || !yocoData.redirectUrl) {
      throw new Error("Yoco het nie 'n 'checkout ID' of 'redirectUrl' teruggestuur nie.");
    }
    
    // Stoor die Yoco Checkout ID
    await supabaseAdmin
      .from('shop_orders')
      .update({ yoco_charge_id: yocoData.id })
      .eq('id', orderId);
    
    console.log(`API: Yoco URL (${yocoData.redirectUrl}) ontvang. Stuur terug na kliënt...`);
    
    // --- 4. Stuur die URL terug na die kliënt ---
    // Ons stuur die ID en die URL, presies soos jou voorbeeld
    return NextResponse.json({ redirectUrl: yocoData.redirectUrl, checkoutId: yocoData.id });

  } catch (error) {
    console.error("Fout in /api/yoco/create-checkout:", error);
    
    const finalOrderId = orderId;
    if (finalOrderId) {
      await supabaseAdmin
        .from('shop_orders')
        .update({ status: 'failed', admin_notes: error instanceof Error ? error.message : 'Onbekende fout' })
        .eq('id', finalOrderId);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Interne Bediener Fout';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}