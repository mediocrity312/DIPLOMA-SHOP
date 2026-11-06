import { Link } from 'react-router-dom';

function HeartIcon({ filled }) {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.8 8.7c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z"
      />
    </svg>
  );
}

export default function ProductCard({
  cartQuantity = 0,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
  product,
}) {
  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="relative m-2.5 overflow-hidden rounded-xl bg-slate-50">
        <Link
          to={`/product/${product.id}`}
          aria-label={`Подробнее о товаре: ${product.title}`}
          className="flex aspect-[4/3] items-center justify-center p-5"
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105"
          />
        </Link>
        {product.discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white">
            −{Math.round(product.discountPercentage)}%
          </span>
        )}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={
            isWishlisted
              ? `Убрать ${product.title} из избранного`
              : `Добавить ${product.title} в избранное`
          }
          aria-pressed={isWishlisted}
          className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/95 shadow-sm backdrop-blur transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            isWishlisted ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
          }`}
        >
          <HeartIcon filled={isWishlisted} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
        <p className="mb-1.5 text-xs font-medium capitalize tracking-wide text-slate-400">
          {product.category}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-1 text-base font-semibold tracking-tight text-slate-900 transition-colors hover:text-indigo-700"
        >
          {product.title}
        </Link>
        <p
          className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500"
          title={product.description}
        >
          {product.description}
        </p>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <strong className="text-xl font-semibold tracking-tight text-indigo-700">
              ${discountedPrice}
            </strong>
            <del className="text-sm text-slate-400">
              ${product.price.toFixed(2)}
            </del>
          </div>
          <span
            className={`mb-0.5 inline-flex shrink-0 items-center gap-1.5 text-xs font-medium ${
              product.stock > 0 ? 'text-emerald-700' : 'text-slate-400'
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                product.stock > 0 ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            />
            {product.stock > 0 ? 'В наличии' : 'Нет в наличии'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product.id)}
          disabled={product.stock <= 0}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300 lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100"
        >
          {cartQuantity > 0 ? `В корзине · ${cartQuantity}` : 'В корзину'}
        </button>
      </div>
    </article>
  );
}
