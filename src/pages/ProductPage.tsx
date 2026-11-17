import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, ProductVariant } from '../types';
import { useCartStore } from '../store/cartStore';

const COLOR_HEX_MAP: Record<string, string> = {
  'Космический оранжевый': '#f97316',
  'Синий': '#2563eb',
  'Серебристый': '#e4e4e7',
  'Белый': '#ffffff',
  'Титан / Зеленый ремешок': '#4ade80',
};

export const ProductPage = () => {
  const params = useParams();
  const slug = params.slug;
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [specsOpen, setSpecsOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, variants:product_variants(*), category:categories(*)')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        const loadedProduct = data as Product;
        setProduct(loadedProduct);
        const variants = loadedProduct.variants || [];
        const defaultVariant = variants.find((v) => v.stock_count > 0) || variants.at(0);
        if (defaultVariant) {
          setSelectedStorage(defaultVariant.storage);
          setSelectedColor(defaultVariant.color);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-96 bg-[#222226] rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-zinc-400 text-lg">Товар не найден</p>
        <Link to="/catalog" className="text-orange-500 mt-4 inline-block">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const variants = product.variants || [];
  const storages = Array.from(
    new Set(variants.map((v) => v.storage).filter((s): s is string => s !== null))
  );
  const colors = Array.from(new Set(variants.map((v) => v.color)));

  const isColorAvailable = (color: string, storage: string | null): boolean => {
    const match = variants.find((v) => v.color === color && v.storage === storage);
    return Boolean(match && match.stock_count > 0);
  };

  const handleStorageChange = (newStorage: string) => {
    setSelectedStorage(newStorage);
    if (!isColorAvailable(selectedColor, newStorage)) {
      const fallbackColor = colors.find((c) => isColorAvailable(c, newStorage));
      if (fallbackColor) setSelectedColor(fallbackColor);
    }
  };

  const activeVariant: ProductVariant | undefined = variants.find(
    (v) => v.color === selectedColor && v.storage === selectedStorage
  );

  const handleAddToCart = () => {
    if (!activeVariant || activeVariant.stock_count <= 0) return;
    addItem({
      variantId: activeVariant.id,
      productId: product.id,
      name: product.name,
      color: activeVariant.color,
      storage: activeVariant.storage,
      price: activeVariant.price,
      imageUrl: activeVariant.image_url,
      maxStock: activeVariant.stock_count,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const specsEntries = Object.entries(product.specs || {});
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-20">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Назад в каталог</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="bg-[#222226] border border-zinc-800/80 rounded-3xl p-8 aspect-square flex items-center justify-center">
          <img
            src={activeVariant?.image_url || 'https://placehold.co'}
            alt={product.name}
            className="w-full h-full object-contain transition-all duration-300"
          />
        </div>

        <div className="bg-[#222226] border border-zinc-800/80 rounded-3xl p-6 sm:p-8">
          {product.category && (
            <span className="text-xs font-medium text-orange-500 uppercase tracking-wider">
              {product.category.name}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-4">
            <span className="text-3xl font-bold text-white">
              {activeVariant ? `${activeVariant.price.toLocaleString('ru-RU')} ₽` : 'Нет в наличии'}
            </span>
            {activeVariant && activeVariant.stock_count > 0 && (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                В наличии ({activeVariant.stock_count} шт.)
              </span>
            )}
          </div>

          {storages.length > 0 && (
            <div className="mt-8">
              <span className="text-sm text-zinc-400 block mb-3">Объем памяти</span>
              <div className="flex flex-wrap gap-3">
                {storages.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => handleStorageChange(storage)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      selectedStorage === storage
                        ? 'border-orange-500 bg-orange-500/15 text-white'
                        : 'border-zinc-700 bg-[#18181b] text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    {storage} ГБ
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7">
            <span className="text-sm text-zinc-400 block mb-3">
              Цвет: <strong className="text-white font-medium">{selectedColor}</strong>
            </span>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => {
                const available = isColorAvailable(color, selectedStorage);
                const isSelected = selectedColor === color;
                const hex = COLOR_HEX_MAP[color] || '#71717a';
                return (
                  <button
                    key={color}
                    disabled={!available}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm border transition-all ${
                      !available
                        ? 'opacity-35 cursor-not-allowed border-zinc-800 bg-[#18181b] text-zinc-500'
                        : isSelected
                        ? 'border-orange-500 bg-orange-500/15 text-white cursor-pointer'
                        : 'border-zinc-700 bg-[#18181b] text-zinc-300 hover:border-zinc-500 cursor-pointer'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <span>{color}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-9">
            <button
              onClick={handleAddToCart}
              disabled={!activeVariant || activeVariant.stock_count <= 0}
              className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2.5 transition-all ${
                addedFeedback
                  ? 'bg-emerald-600 text-white'
                  : !activeVariant || activeVariant.stock_count <= 0
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
              }`}
            >
              {addedFeedback ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Добавлено в корзину</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Добавить в корзину</span>
                </>
              )}
            </button>
          </div>

          {specsEntries.length > 0 && (
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <button
                onClick={() => setSpecsOpen(!specsOpen)}
                className="w-full flex items-center justify-between text-left text-orange-500 hover:text-orange-400 font-medium text-sm cursor-pointer"
              >
                <span>Характеристики</span>
                {specsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {specsOpen && (
                <div className="mt-4 space-y-2.5 text-sm">
                  {specsEntries.map((entry) => (
                    <div
                      key={entry.at(0)}
                      className="flex justify-between py-2 border-b border-zinc-800/60 last:border-none gap-4"
                    >
                      <span className="text-zinc-400">{entry.at(0)}</span>
                      <span className="text-zinc-100 font-medium text-right">{entry.at(1)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
