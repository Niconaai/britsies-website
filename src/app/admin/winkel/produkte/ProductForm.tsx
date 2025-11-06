// src/app/admin/winkel/produkte/ProductForm.tsx
'use client';

import { useState } from 'react';
// --- 1. VOEG useFormStatus EN Image BY ---
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { DbShopProduct, DbShopCategory } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';
// import SubmitButton from '@/components/ui/SubmitButton'; // <-- NIE MEER NODIG NIE
import ImageUploader from './ImageUploader';

type ProductFormProps = {
  product?: DbShopProduct;
  categories: DbShopCategory[];
  formAction: (formData: FormData) => void;
  submitButtonText: string;
};

// ... FloatingLabelTextArea bly dieselfde ...
const FloatingLabelTextArea = ({ label, name, value, onChange, required, rows = 4 }: any) => (
  <div className="relative w-full">
    <textarea
      id={name}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      required={required}
      rows={rows}
      placeholder=" "
      className="peer w-full rounded-sm border border-zinc-300 bg-transparent px-3.5 pt-4 pb-2 text-zinc-900 
                 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none 
                 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
    />
    <label
      htmlFor={name}
      className="absolute left-3.5 top-2.5 flex items-center gap-0.5 rounded-md bg-white px-1 text-sm text-zinc-500 transition-all duration-200
                 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
                 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-800 peer-focus:bg-white
                 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-zinc-800 peer-not-placeholder-shown:bg-white
                 dark:text-zinc-300 dark:peer-focus:text-white dark:peer-focus:bg-zinc-700 dark:peer-not-placeholder-shown:text-white dark:peer-not-placeholder-shown:bg-zinc-700"
    >
      <span>{label}</span>
      {required && <span className="text-red-600">*</span>}
    </label>
  </div>
);
// --- EINDE VAN FloatingLabelTextArea ---

// --- 2. SKEP DIE VOLSKERM-OORLEG KOMPONENT ---
function LoadingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-xl dark:bg-zinc-800">
        <Image
          src="/CircleLoader.gif"
          alt="Besig om te laai..."
          width={80}
          height={80}
          unoptimized={true}
        />
        <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Besig om produk te stoor...
        </p>
      </div>
    </div>
  );
}

// --- 3. SKEP 'N SUB-KOMPONENT VIR DIE KNOPPIE ---
function FormSubmitButton({ submitButtonText }: { submitButtonText: string }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center min-w-[120px] min-h-[38px]"
    >
      {pending ? (
        <>
          <Image
            src="/CircleLoader.gif"
            alt="Besig..."
            width={20}
            height={20}
            unoptimized={true}
            className="mr-2"
          />
          Stoor...
        </>
      ) : (
        submitButtonText
      )}
    </button>
  );
}
// --- EINDE VAN NUWE KOMPONENTE ---


export default function ProductForm({ product, categories, formAction, submitButtonText }: ProductFormProps) {
  
  const [formData, setFormData] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    stock_level: product?.stock_level ?? 0,
    category_id: product?.category_id ?? '',
    image_url: product?.image_url ?? '',
    is_active: product?.is_active ?? true,
    weight_kg: product?.weight_kg ?? 0,
    length_cm: product?.length_cm ?? 0,
    width_cm: product?.width_cm ?? 0,
    height_cm: product?.height_cm ?? 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: url,
    }));
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));
  
  return (
    <form action={formAction} className="space-y-6">
      {/* --- 4. VOEG DIE OORLEG BY --- */}
      <LoadingOverlay />

      {product && (
        <input type="hidden" name="productId" value={product.id} />
      )}

      {/* ... (res van die vorm-velde bly dieselfde) ... */}
      <input type="hidden" name="image_url" value={formData.image_url} />
      <fieldset className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <FloatingLabelInputField
                label="Produknaam"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <FloatingLabelTextArea
                label="Beskrywing"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
            />
        </div>
        <div className="space-y-6">
            <FloatingLabelInputField
                label="Prys (ZAR)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number"
                step="0.01" // Laat sente toe
                required
            />
            <FloatingLabelInputField
                label="Voorraad Vlak"
                name="stock_level"
                value={formData.stock_level}
                onChange={handleChange}
                type="number"
                step="1"
                required
            />
             <FloatingLabelSelectFieldCustom
                label="Kategorie"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                options={categoryOptions}
             />
        </div>
      </fieldset>
      
      <fieldset className="grid grid-cols-1 gap-6 md:grid-cols-3">
         <div className="md:col-span-2">
            <ImageUploader
              currentImageUrl={formData.image_url}
              onUploadComplete={handleImageUpload}
            />
         </div>
         <div className="flex items-center pt-4">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300">
              Produk is Aktief?
            </label>
        </div>
      </fieldset>

      <fieldset className="rounded-md border border-zinc-300 p-4 dark:border-zinc-600">
        <legend className="px-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Dimensies (vir toekomstige koerier-integrasie)
        </legend>
        <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-4">
            <FloatingLabelInputField
                label="Gewig (kg)"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                type="number"
                step="0.01"
            />
            <FloatingLabelInputField
                label="Lengte (cm)"
                name="length_cm"
                value={formData.length_cm}
                onChange={handleChange}
                type="number"
                step="0.1"
            />
            <FloatingLabelInputField
                label="Breedte (cm)"
                name="width_cm"
                value={formData.width_cm}
                onChange={handleChange}
                type="number"
                step="0.1"
            />
            <FloatingLabelInputField
                label="Hoogte (cm)"
                name="height_cm"
                value={formData.height_cm}
                onChange={handleChange}
                type="number"
                step="0.1"
            />
        </div>
      </fieldset>

      {/* --- 5. VERVANG DIE SubmitButton MET ONS NUWE KNOPPIE --- */}
      <div className="flex justify-end">
        <FormSubmitButton submitButtonText={submitButtonText} />
      </div>
    </form>
  );
}