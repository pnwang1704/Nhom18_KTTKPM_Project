import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(
          item => item.productId === newItem.productId && 
                  item.color === newItem.color && 
                  item.storage === newItem.storage
        );
        
        if (existingItem) {
          return {
            items: state.items.map(item => 
              item.productId === newItem.productId && item.color === newItem.color && item.storage === newItem.storage
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            )
          };
        }
        return { items: [...state.items, newItem] };
      }),
      
      removeItem: (productId, color, storage) => set((state) => ({
        items: state.items.filter(item => 
          !(item.productId === productId && item.color === color && item.storage === storage)
        )
      })),
      
      updateQuantity: (productId, color, storage, quantity) => set((state) => ({
        items: state.items.map(item => 
          item.productId === productId && item.color === color && item.storage === storage
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'apple-cart-storage',
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0 || !version) {
          return { items: persistedState.items || [] };
        }
        return persistedState;
      }
    }
  )
);
