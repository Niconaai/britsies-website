// src/app/admin/winkel/produkte/ProductForm.tsx
'use client';

import { useState } from 'react';
import { DbShopProduct, DbShopCategory } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';
import SubmitButton from '@/components/ui/SubmitButton'; 
import ImageUploader from './ImageUploader';

type ProductFormProps = {
  product?: DbShopProduct;
  categories: DbShopCategory[];
  formAction: (formData: FormData) => void;
  submitButtonText: string;
};

// 'n Beheerde Textarea komponent (nou binne-in)
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


export default function ProductForm({ product, categories, formAction, submitButtonText }: ProductFormProps) {
  
  // --- 3. STEL 'STATE' OP VIR DIE VORM ---
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
      {product && (
        <input type="hidden" name="productId" value={product.id} />
      )}

      <input type="hidden" name="image_url" value={formData.image_url} />

      {/* Hoof Inligting */}
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
                required
            />
            <FloatingLabelInputField
                label="Voorraad Vlak"
                name="stock_level"
                value={formData.stock_level}
                onChange={handleChange}
                type="number"
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
      
      {/* Prent & Status */}
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

      {/* Dimensies (Vir Koerier) */}
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
            />
            <FloatingLabelInputField
                label="Lengte (cm)"
                name="length_cm"
                value={formData.length_cm}
                onChange={handleChange}
                type="number"
            />
            <FloatingLabelInputField
                label="Breedte (cm)"
                name="width_cm"
                value={formData.width_cm}
                onChange={handleChange}
                type="number"
            />
            <FloatingLabelInputField
                label="Hoogte (cm)"
                name="height_cm"
                value={formData.height_cm}
                onChange={handleChange}
                type="number"
            />
        </div>
      </fieldset>

      {/* Stoor Knoppie */}
      <div className="flex justify-end">
        <SubmitButton
          formAction={formAction}
          defaultText={submitButtonText}
          loadingText="Stoor..."
          className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        />
      </div>
    </form>
  );
}