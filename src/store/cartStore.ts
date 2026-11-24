import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Добавление товара в корзину
      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.variantId === newItem.variantId);

        if (existingItem) {
          // Если товар уже есть, увеличиваем количество (но не больше остатка на складе)
          const nextQty = Math.min(existingItem.quantity + 1, existingItem.maxStock);
          set({
            items: currentItems.map((i) =>
              i.variantId === newItem.variantId ? { ...i, quantity: nextQty } : i
            ),
          });
        } else {
          // Если товара еще нет, добавляем его с количеством 1
          set({ items: [...currentItems, { ...newItem, quantity: 1 }] });
        }
      },

      // Удаление позиции из корзины
      removeItem: (variantId) => {
        set({
          items: get().items.filter((i) => i.variantId !== variantId),
        });
      },

      // Изменение количества (+ или -)
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.maxStock) }
              : i
          ),
        });
      },

      // Очистка корзины после оформления заказа
      clearCart: () => set({ items: [] }),

      // Подсчет общей суммы в рублях
      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      // Подсчет общего числа товаров для бейджика в шапке
      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'istore-cart-storage', // Ключ в памяти браузера
    }
  )
);
