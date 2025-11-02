// src/app/winkel/QuantityPicker.tsx
'use client';

interface QuantityPickerProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
  maxStock: number;
  idSuffix: string; // Vir unieke 'id' velde
}

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);


export default function QuantityPicker({ quantity, setQuantity, maxStock, idSuffix }: QuantityPickerProps) {
  
  const handleDecrement = () => {
    setQuantity(Math.max(1, quantity - 1)); // Moenie onder 1 gaan nie
  };

  const handleIncrement = () => {
    setQuantity(Math.min(maxStock, quantity + 1)); // Moenie oor maks voorraad gaan nie
  };

  return (
    <div className="flex items-center">
      <label htmlFor={`quantity-${idSuffix}`} className="sr-only">Hoeveelheid</label>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className="px-3 py-2 border border-zinc-300 rounded-l-md text-zinc-700 bg-zinc-50 hover:bg-zinc-100 disabled:opacity-50 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-600"
      >
        <MinusIcon />
      </button>
      <input
        id={`quantity-${idSuffix}`}
        name={`quantity-${idSuffix}`}
        type="text"
        value={quantity}
        readOnly // Maak dit 'read-only' sodat gebruiker nie kan tik nie
        className="w-12 border-y border-zinc-300 bg-white text-center font-medium text-zinc-900 focus:outline-none focus:ring-0 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= maxStock}
        className="px-3 py-2 border border-zinc-300 rounded-r-md text-zinc-700 bg-zinc-50 hover:bg-zinc-100 disabled:opacity-50 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-600"
      >
        <PlusIcon />
      </button>
    </div>
  );
}