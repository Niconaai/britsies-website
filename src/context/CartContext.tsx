// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { DbShopProduct } from '@/types/supabase';

// Tipe vir 'n item in die mandjie
export type CartItem = {
  product: DbShopProduct;
  quantity: number;
};

// Tipe vir die Context se waardes
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: DbShopProduct, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
};

// Skep die Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Skep die Provider-komponent
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Funksie om 'n item by te voeg
  const addToCart = (product: DbShopProduct, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Werk hoeveelheid op as item reeds bestaan
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Voeg nuwe item by
        return [...prevItems, { product, quantity }];
      }
    });
    console.log(`Produk ${product.name} by mandjie gevoeg.`);
  };

  // Funksie om 'n item te verwyder
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => 
      prevItems.filter(item => item.product.id !== productId)
    );
  };

  // Funksie om hoeveelheid op te dateer
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Funksie om mandjie leeg te maak
  const clearCart = () => {
    setCartItems([]);
  };

  // Bereken die totaal
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product.price * item.quantity),
    0
  );

  // Bereken totale aantal items
  const itemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Skep 'n "hook" om die context maklik te gebruik
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};