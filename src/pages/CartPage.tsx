import { SeoHead } from '../components/SeoHead';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-[#222226] border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-5 text-zinc-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Ваша корзина пуста</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-md mx-auto">
          Перейдите в каталог, выберите подходящую модель Apple, цвет и объем памяти.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl mt-6 transition-colors"
        >
          <span>Перейти в каталог</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 pb-20">
      <SeoHead title="Корзина | i:Store" noIndex={true} />
      <h1 className="text-3xl font-bold text-white mb-8">Корзина</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Список товаров */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="bg-[#222226] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-6"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-[#18181b] rounded-xl p-2 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  {item.storage ? `${item.storage} ГБ, ` : ''}
                  {item.color}
                </p>
                <p className="text-base font-bold text-orange-400 mt-2">
                  {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                </p>
              </div>

              {/* Счетчик количества и удаление */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                <div className="flex items-center bg-[#18181b] border border-zinc-800 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="p-1.5 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-semibold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.variantId)}
                  title="Удалить товар"
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Блок Итого */}
        <div className="bg-[#222226] border border-zinc-800/80 rounded-2xl p-6 sticky top-28">
          <h2 className="text-lg font-bold text-white mb-4">Сумма заказа</h2>

          <div className="space-y-3 text-sm border-b border-zinc-800 pb-4">
            <div className="flex justify-between text-zinc-400">
              <span>Товары ({items.reduce((s, i) => s + i.quantity, 0)} шт.)</span>
              <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Доставка по Новосибирску</span>
              <span className="text-emerald-400">Бесплатно</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline mt-4 mb-6">
            <span className="text-base font-medium text-zinc-300">Итого:</span>
            <span className="text-2xl font-bold text-white">
              {totalPrice.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Оплатить
          </button>
        </div>
      </div>
    </div>
  );
};
