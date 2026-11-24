import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../store/cartStore';

describe('Тестирование логики корзины i:Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('должен добавлять товар в корзину и считать итоговую сумму', () => {
    useCartStore.getState().addItem({
      variantId: 'var-1',
      productId: 'prod-1',
      name: 'iPhone 17 Pro',
      color: 'Космический оранжевый',
      storage: '256',
      price: 134990,
      imageUrl: 'test.png',
      maxStock: 5,
    });

    expect(useCartStore.getState().getTotalCount()).toBe(1);
    expect(useCartStore.getState().getTotalPrice()).toBe(134990);
  });

  it('не должен превышать максимальный остаток товара на складе', () => {
    useCartStore.getState().addItem({
      variantId: 'var-2',
      productId: 'prod-1',
      name: 'iPhone 17 Pro',
      color: 'Синий',
      storage: '512',
      price: 154990,
      imageUrl: 'test.png',
      maxStock: 1,
    });

    useCartStore.getState().addItem({
      variantId: 'var-2',
      productId: 'prod-1',
      name: 'iPhone 17 Pro',
      color: 'Синий',
      storage: '512',
      price: 154990,
      imageUrl: 'test.png',
      maxStock: 1,
    });

    expect(useCartStore.getState().getTotalCount()).toBe(1);
  });

  it('должен полностью очищать корзину после оформления заказа', () => {
    useCartStore.getState().addItem({
      variantId: 'var-3',
      productId: 'prod-2',
      name: 'AirPods Pro 3',
      color: 'Белый',
      storage: null,
      price: 22990,
      imageUrl: 'test.png',
      maxStock: 10,
    });

    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items.length).toBe(0);
  });
});
