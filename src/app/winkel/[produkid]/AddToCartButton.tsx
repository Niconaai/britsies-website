// src/app/winkel/[produkid]/AddToCartButton.tsx
'use client';

import { useCart } from "@/context/CartContext";
import type { DbShopProduct } from "@/types/supabase";
import { useState } from "react";
import QuantityPicker from "../../../components/ui/QuantityPicker";

export default function AddToCartButton({ product }: { product: DbShopProduct }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const maxStock = product.stock_level > 0 ? product.stock_level : 1;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity} x ${product.name} by mandjie gevoeg!`);
  };

  return (
    <div className="mt-10 flex gap-x-4">
      <QuantityPicker
        quantity={quantity}
        setQuantity={setQuantity}
        maxStock={maxStock}
        idSuffix={product.id}
      />

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={product.stock_level <= 0}
        className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:disabled:bg-zinc-600"
      >
        {product.stock_level > 0 ? 'Voeg by Mandjie' : 'Uil voorraad'}
      </button>
    </div>
  );
}