// src/app/admin/winkel/produkte/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server'; 
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { DbShopProduct } from '@/types/supabase';

// (checkAdminAuth en getProductDataFromFormData bly dieselfde)
// ... (plak daardie funksies hier in)
async function checkAdminAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') {
    throw new Error("Not authorized");
  }
  return supabase;
}

function getProductDataFromFormData(formData: FormData): Omit<DbShopProduct, 'id' | 'created_at'> {
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock_level') as string, 10);
    
    return {
        name: formData.get('name') as string,
        description: formData.get('description') as string || null,
        price: isNaN(price) ? 0.00 : price,
        stock_level: isNaN(stock) ? 0 : stock,
        category_id: formData.get('category_id') as string || null,
        image_url: formData.get('image_url') as string || null,
        is_active: formData.get('is_active') === 'on',
        weight_kg: parseFloat(formData.get('weight_kg') as string) || null,
        length_cm: parseInt(formData.get('length_cm') as string, 10) || null,
        width_cm: parseInt(formData.get('width_cm') as string, 10) || null,
        height_cm: parseInt(formData.get('height_cm') as string, 10) || null,
        options: null, 
  };
}
// --- Einde van hulpfunksies ---

export async function createProduct(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const productData = getProductDataFromFormData(formData);

  if (!productData.name || productData.price === null) {
    return redirect('/admin/winkel/produkte/skep?error=Naam en Prys word vereis.');
  }

  const { error } = await supabase.from('shop_products').insert(productData);

  if (error) {
    console.error('Supabase insert error:', error);
    return redirect(`/admin/winkel/produkte/skep?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/winkel/produkte');
  redirect('/admin/winkel/produkte');
}

export async function updateProduct(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const productId = formData.get('productId') as string;
  if (!productId) {
    return redirect('/admin/winkel/produkte?error=Produk ID word vermis vir opdatering.');
  }

  const productData = getProductDataFromFormData(formData);

  if (!productData.name || productData.price === null) {
    // OPGEDATEERDE PAD
    return redirect(`/admin/winkel/produkte/wysig/${productId}?error=Naam en Prys word vereis.`);
  }

  const { error } = await supabase
    .from('shop_products')
    .update(productData)
    .eq('id', productId);

  if (error) {
    console.error('Supabase update error:', error);
    // OPGEDATEERDE PAD
    return redirect(`/admin/winkel/produkte/wysig/${productId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/winkel/produkte');
  // OPGEDATEERDE PAD
  revalidatePath(`/admin/winkel/produkte/wysig/${productId}`);
  redirect('/admin/winkel/produkte');
}


export async function deleteProduct(formData: FormData) {
    let supabase;
    try {
        supabase = await checkAdminAuth();
    } catch (error) {
        return redirect('/login');
    }

    const productId = formData.get('productId') as string;
    if (!productId) {
        return redirect('/admin/winkel/produkte?error=Produk ID word vermis vir skrapping.');
    }

    const { error } = await supabase
        .from('shop_products')
        .delete()
        .eq('id', productId);

    if (error) {
        console.error(`Supabase delete error for ${productId}:`, error);
        return redirect(`/admin/winkel/produkte?error=${encodeURIComponent('Kon nie produk skrap nie: ' + error.message)}`);
    }

    revalidatePath('/admin/winkel/produkte');
    // Bly op dieselfde bladsy
}