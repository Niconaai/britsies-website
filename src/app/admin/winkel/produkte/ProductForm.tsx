// src/app/admin/shop/products/ProductForm.tsx
'use client';

import { DbShopProduct, DbShopCategory } from '@/types/supabase';
import FloatingLabelInput from '@/components/ui/FloatingLabelInput'; // <-- KORREKTE IMPORTERING
import SubmitButton from '@/components/ui/SubmitButton'; 

type ProductFormProps = {
  product?: DbShopProduct;
  categories: DbShopCategory[];
  formAction: (formData: FormData) => void;
  submitButtonText: string;
};

export default function ProductForm({ product, categories, formAction, submitButtonText }: ProductFormProps) {
  
  // 'n Eenvoudige textarea komponent
  const FloatingLabelTextArea = ({ label, name, defaultValue, required, rows = 4 }: any) => (
    <div className="relative w-full">
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""} // <-- GEBRUIK defaultValue
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

  return (
    <form action={formAction} className="space-y-6">
      {product && (
        <input type="hidden" name="productId" value={product.id} />
      )}

      {/* Hoof Inligting */}
      <fieldset className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <FloatingLabelInput
                label="Produknaam"
                id="name"
                name="name"
                defaultValue={product?.name}
                required
            />
            <FloatingLabelTextArea
                label="Beskrywing"
                name="description"
                defaultValue={product?.description}
                rows={5}
            />
        </div>
        <div className="space-y-6">
            <FloatingLabelInput
                label="Prys (ZAR)"
                id="price"
                name="price"
                defaultValue={product?.price}
                type="number"
                step="0.01"
                required
            />
            <FloatingLabelInput
                label="Voorraad Vlak"
                id="stock_level"
                name="stock_level"
                defaultValue={product?.stock_level}
                type="number"
                step="1"
                required
            />
             <select
                id="category_id"
                name="category_id"
                defaultValue={product?.category_id ?? ""}
                className="peer w-full appearance-none rounded-sm border border-zinc-300 bg-transparent px-3.5 pt-4 pb-2 text-zinc-900 
                           focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none
                           dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
            >
                <option value="">Kies 'n kategorie...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
        </div>
      </fieldset>
      
      {/* Prent & Status */}
      <fieldset className="grid grid-cols-1 gap-6 md:grid-cols-3">
         <div className="md:col-span-2">
            <FloatingLabelInput
                label="Prent URL"
                id="image_url"
                name="image_url"
                defaultValue={product?.image_url ?? ''} // <-- Maak seker dis 'n string
                type="url"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              (Ons sal later 'n oplaaier bou. Plak vir eers 'n URL)
            </p>
         </div>
         <div className="flex items-center pt-4">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              defaultChecked={product?.is_active ?? true}
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
            <FloatingLabelInput
                label="Gewig (kg)"
                id="weight_kg"
                name="weight_kg"
                defaultValue={product?.weight_kg ?? 0.5}
                type="number"
                step="0.01"
            />
            <FloatingLabelInput
                label="Lengte (cm)"
                id="length_cm"
                name="length_cm"
                defaultValue={product?.length_cm ?? 10}
                type="number"
                step="1"
            />
            <FloatingLabelInput
                label="Breedte (cm)"
                id="width_cm"
                name="width_cm"
                defaultValue={product?.width_cm ?? 10}
                type="number"
                step="1"
            />
            <FloatingLabelInput
                label="Hoogte (cm)"
                id="height_cm"
                name="height_cm"
                defaultValue={product?.height_cm ?? 5}
                type="number"
                step="1"
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