import { SeoHead } from '../components/SeoHead';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const CatalogPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Загружаем категории и все товары параллельно
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase
          .from('products')
          .select('*, variants:product_variants(*), category:categories(*)')
          .order('created_at', { ascending: true }),
      ]);

      if (catRes.data) setCategories(catRes.data as Category[]);
      if (prodRes.data) setProducts(prodRes.data as Product[]);

      setLoading(false);
    };

    fetchData();
  }, []);

  // Фильтрация по выбранной категории и строке поиска
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category?.slug === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

    return (
    <div className="max-w-6xl mx-auto px-4 py-10 pb-20">
      <SeoHead
        title="Каталог техники Apple | i:Store Новосибирск"
        description="Полный каталог устройств Apple в наличии в Новосибирске: удобный поиск и фильтрация по категориям iPhone, Watch и AirPods."
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Каталог техники</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Выберите категорию или воспользуйтесь поиском по моделям
          </p>
        </div>

        {/* Поле поиска */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Поиск модели..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#222226] border border-zinc-800 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Вкладки категорий */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-orange-500 text-white'
              : 'bg-[#222226] text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          Все устройства
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              selectedCategory === cat.slug
                ? 'bg-orange-500 text-white'
                : 'bg-[#222226] text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Сетка товаров */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-96 bg-[#222226] border border-zinc-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#222226] border border-zinc-800 rounded-2xl p-12 text-center">
          <p className="text-zinc-400">По вашему запросу ничего не найдено.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 text-sm text-orange-500 hover:text-orange-400 font-medium cursor-pointer"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
};
