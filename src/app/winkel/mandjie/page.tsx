// src/app/winkel/mandjie/page.tsx
'use client';

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import QuantityPicker from "../../../components/ui/QuantityPicker";

// Hulpfunksie om prys te formateer
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('af-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

// Ikoon vir "verwyder"
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.54 0c.07-.156.147-.312.227-.468a3.75 3.75 0 0 1 5.569 0c.08.156.156.312.227.468m0 0a48.11 48.11 0 0 1 3.478-.397m-3.478.397a48.11 48.11 0 0 0-3.478-.397m12.54 0v1.397c0 .621-.504 1.125-1.125 1.125H9.375c-.621 0-1.125-.504-1.125-1.125V5.79m12.54 0H4.772" />
  </svg>
);

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart();

  return (
    <div> <Link
      href="/winkel"
      className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
    >
      &larr; Terug na alle produkte
    </Link>
      <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-6 md:p-8">

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-8">
          Jou Winkelmandjie
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Jou mandjie is leeg.</p>
            <Link href="/winkel" className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700">
              Begin Inkopies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">

            {/* Lys van Items (Links) */}
            <div className="lg:col-span-2">
              <ul role="list" className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {cartItems.map((item) => (
                  <li key={item.product.id} className="flex py-6">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
                      <Image
                        src={item.product.image_url || '/wapen-copy.png'}
                        alt={item.product.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-zinc-900 dark:text-white">
                          <h3>
                            <Link href={`/winkel/${item.product.id}`}>{item.product.name}</Link>
                          </h3>
                          <p className="ml-4">{formatCurrency(item.product.price * item.quantity)}</p>
                        </div>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          Prys: {formatCurrency(item.product.price)}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <QuantityPicker
                          quantity={item.quantity}
                          setQuantity={(newQuantity) => updateQuantity(item.product.id, newQuantity)}
                          maxStock={item.product.stock_level > 0 ? item.product.stock_level : 1}
                          idSuffix={item.product.id}
                        />

                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
                          >
                            <TrashIcon />
                            Verwyder
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opsomming (Regs) */}
            <div className="lg:col-span-1 mt-10 lg:mt-0">
              <div className="sticky top-24 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-6">
                <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Opsomming</h2>
                <dl className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-zinc-600 dark:text-zinc-400">Subtotaal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</dt>
                    <dd className="text-sm font-medium text-zinc-900 dark:text-white">{formatCurrency(cartTotal)}</dd>
                  </div>
                  {/* Ons kan Aflewering/Shipping hier byvoeg later */}
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 pt-4">
                    <dt className="text-base font-medium text-zinc-900 dark:text-white">Totaal</dt>
                    <dd className="text-base font-medium text-zinc-900 dark:text-white">{formatCurrency(cartTotal)}</dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <Link
                    href="/winkel/checkout" // Die volgende stap
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700"
                  >
                    Gaan na Checkout
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-zinc-500">
                  <p>
                    of&nbsp;
                    <Link href="/winkel" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      Gaan voort met Inkopies
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}