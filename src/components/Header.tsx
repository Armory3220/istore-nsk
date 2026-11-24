import { Link, useLocation } from 'react-router-dom';
import { MapPin, ShoppingBag, User, LayoutGrid } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export const Header = () => {
  const location = useLocation();
  const totalCount = useCartStore((state) => state.getTotalCount());

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#18181b]/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* Верхняя информационная полоса (город, телефон, график) */}
        <div className="flex items-center justify-between py-2 text-xs text-zinc-400 border-b border-zinc-800/60">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-zinc-200 font-medium">Новосибирск</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:+79999999999" className="hover:text-white transition-colors">
              +7 (999) 999-99-99
            </a>
            <span className="hidden sm:inline">10:00–21:00 по НСК</span>
          </div>
        </div>

        {/* Основная навигация */}
        <div className="flex items-center justify-between h-16">
          {/* Логотип i:Store */}
          <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center">
            i<span className="text-orange-500">:</span>Store
          </Link>

          {/* Правое меню: Каталог, Корзина, Аккаунт */}
          <nav className="flex items-center gap-6 sm:gap-8">
            <Link
              to="/catalog"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/catalog') ? 'text-orange-500' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Каталог</span>
            </Link>

            <Link
              to="/cart"
              className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/cart') ? 'text-orange-500' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </div>
              <span>Корзина</span>
            </Link>

            <Link
              to="/account"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/account') ? 'text-orange-500' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Аккаунт</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
