// src/app/admin/winkel/produkte/DeleteProductButton.tsx
'use client';

import { deleteProduct } from './actions';

export default function DeleteProductButton({ productId }: { productId: string }) {
  
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!confirm('Is jy seker jy wil hierdie produk skrap?')) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteProduct} className="inline">
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
        onClick={handleDelete} // <-- Hierdie is nou veilig binne 'n 'use client' komponent
      >
        Skrap
      </button>
    </form>
  );
}