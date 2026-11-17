import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, variants:product_variants(*), category:categories(*)')
        .eq('is_featured', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Ошибка загрузки товаров:', error);
      } else if (data) {
        setFeaturedProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchFeatured();
  }, []);

  return (
    <div className="pb-20">
      {/* 1. Главный баннер */}
      <section className="relative overflow-hidden border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900 to-[#18181b]">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 relative z-10 text-center">
          <span className="inline-block px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium mb-6">
            Оригинальная техника Apple в Новосибирске
          </span>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Новые грани технологий вместе с <span className="text-orange-500">i:Store</span>
          </h1>

          <p className="mt-6 text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
            Актуальные модели iPhone, Mac, Apple Watch и AirPods в наличии. Гарантия 1 год и бесплатная доставка по городу в день заказа.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              <span>Перейти в каталог</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Блок преимуществ */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#222226] border border-zinc-800/80 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">100% оригинал</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Только запечатанная техника с проверкой серийного номера перед оплатой.
              </p>
            </div>
          </div>

          <div className="bg-[#222226] border border-zinc-800/80 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Быстрая доставка</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Бесплатно привезем курьером по Новосибирску за 2 часа или подготовим к самовывозу.
              </p>
            </div>
          </div>

          <div className="bg-[#222226] border border-zinc-800/80 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Помощь с настройкой</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Перенесем данные со старого устройства и установим нужные приложения.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Популярные товары */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Популярные модели</h2>
          <Link
            to="/catalog"
            className="text-sm text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1"
          >
            <span>Все товары</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-96 bg-[#222226] border border-zinc-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
