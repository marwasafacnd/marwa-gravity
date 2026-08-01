import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  discountRate: number;
  setDiscountRate: (rate: number) => void;
  discountAmount: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountRate, setDiscountRate] = useState<number>(0); // 0 to 100 percentage
  const TAX_RATE = 0.08; // 8% standard sales tax

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: newQty * Number(product.price),
        };
        return updated;
      }

      return [
        ...prevCart,
        {
          product,
          quantity: 1,
          subtotal: Number(product.price),
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity,
            subtotal: quantity * Number(item.product.price),
          };
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountRate(0);
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return (subtotal * discountRate) / 100;
  }, [subtotal, discountRate]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = useMemo(() => {
    return taxableAmount * TAX_RATE;
  }, [taxableAmount]);

  const total = useMemo(() => {
    return taxableAmount + tax;
  }, [taxableAmount, tax]);

  const itemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        discountRate,
        setDiscountRate,
        discountAmount,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
