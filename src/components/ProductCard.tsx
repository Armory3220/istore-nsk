import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const variants = product.variants || [];

  const minPrice = variants.length > 0
    ? Math.min(...variants.map((v) => v.price))
    : 0;

  const hasDifferentPrices =
    variants.length > 1 &&
    new Set(variants.map((v) => v.price)).size > 1;

  const firstVariant = variants.at(0);
  const previewImage =
    firstVariant?.image_url || 'https://placehold.co';

  const formattedPrice = minPrice.toLocaleString('ru-RU');

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-[#222226] border border-zinc-800/80 hover:border-orange-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-square w-full bg-[#18181b] rounded-xl mb-5 overflow-hidden flex items-center justify-center p-4">
        <img
          src={previewImage}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div>
        {product.category && (
          <span className="text-xs text-zinc-500 uppercase tracking-wider">
            {product.category.name}
          </span>
        )}
        <h3 className="text-lg font-semibold text-white mt-1 group-hover:text-orange-400 transition-colors">
          {product.name}
        </h3>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-bold text-white">
            {hasDifferentPrices ? `от ${formattedPrice} ₽` : `${formattedPrice} ₽`}
          </span>

          <span className="text-xs font-medium bg-zinc-800 group-hover:bg-orange-500 text-zinc-300 group-hover:text-white px-3 py-1.5 rounded-lg transition-colors">
            Выбрать
          </span>
        </div>
      </div>
    </Link>
  );
};
