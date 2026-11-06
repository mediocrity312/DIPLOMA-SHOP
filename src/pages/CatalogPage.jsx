import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import StoreHeader from '../components/StoreHeader.jsx';
import { useProductStore } from '../store/useProductStore.js';

const sortOptions = [
  { value: 'price:desc', label: 'По убыванию' },
  { value: 'price:asc', label: 'По возрастанию' },
  { value: 'rating:desc', label: 'По популярности' },
];

const viewTitles = {
  catalog: 'Каталог товаров',
  wishlist: 'Избранное',
  cart: 'Корзина',
};

export default function CatalogPage() {
  const {
    products,
    isLoading,
    error,
    limit,
    skip,
    total,
    sortBy,
    order,
    query,
    fetchProducts,
    setPage,
    setSearch,
    setSort,
  } = useProductStore();
  const [activeView, setActiveView] = useState('catalog');
  const [searchInput, setSearchInput] = useState(query);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (searchInput === query) return undefined;
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput, query, setSearch]);

  const currentPage = Math.floor(skip / limit) + 1;
  const pageCount = Math.ceil(total / limit);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const visibleProducts = products.filter((product) => {
    if (activeView === 'wishlist') return wishlist.includes(product.id);
    if (activeView === 'cart') return Boolean(cart[product.id]);
    return true;
  });

  function toggleWishlist(productId) {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  function addToCart(productId) {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <StoreHeader
        activeView={activeView}
        cartCount={cartCount}
        onSearch={setSearchInput}
        onViewChange={setActiveView}
        query={searchInput}
        wishlistCount={wishlist.length}
      />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="mb-7 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-600">
              Магазин вещей для жизни
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {viewTitles[activeView]}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {activeView === 'catalog'
                ? `${total.toLocaleString('ru-RU')} товаров для ваших любимых моментов`
                : `${visibleProducts.length} ${
                    activeView === 'wishlist' ? 'товаров в избранном' : 'товаров в корзине'
                  }`}
            </p>
          </div>

          {activeView === 'catalog' && (
            <label className="flex items-center gap-3 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm sm:self-auto">
              <span className="whitespace-nowrap text-sm text-slate-500">
                Сортировать:
              </span>
              <select
                value={`${sortBy}:${order}`}
                onChange={(event) => {
                  const [nextSortBy, nextOrder] = event.target.value.split(':');
                  setSort(nextSortBy, nextOrder);
                }}
                className="min-w-36 cursor-pointer border-0 bg-transparent pr-1 text-sm font-medium text-slate-800 outline-none focus:ring-0"
                aria-label="Сортировка товаров"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => fetchProducts()}
              className="shrink-0 rounded-lg bg-white px-4 py-2 font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {isLoading ? (
          <section
            aria-label="Загрузка товаров"
            aria-busy="true"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5"
              >
                <div className="aspect-[4/3] rounded-xl bg-slate-100" />
                <div className="space-y-3 px-3 pb-3 pt-5">
                  <div className="h-3 w-1/3 rounded bg-slate-100" />
                  <div className="h-5 w-3/4 rounded bg-slate-100" />
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="mt-5 h-10 rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </section>
        ) : !error && visibleProducts.length > 0 ? (
          <section
            aria-label="Список товаров"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                cartQuantity={cart[product.id] ?? 0}
                onToggleWishlist={toggleWishlist}
                onAddToCart={addToCart}
              />
            ))}
          </section>
        ) : !error ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-indigo-50 text-indigo-600">
              <svg
                aria-hidden="true"
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L21 8H6"
                />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </span>
            <h2 className="text-lg font-semibold text-slate-900">
              {activeView === 'wishlist'
                ? 'Здесь пока пусто'
                : activeView === 'cart'
                  ? 'Корзина пока пуста'
                  : 'Ничего не найдено'}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              {activeView === 'catalog'
                ? 'Попробуйте изменить поисковый запрос.'
                : 'Загляните в каталог и добавьте то, что вам понравится.'}
            </p>
            {activeView !== 'catalog' && (
              <button
                type="button"
                onClick={() => setActiveView('catalog')}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Перейти в каталог
              </button>
            )}
          </div>
        ) : null}

        {activeView === 'catalog' && !isLoading && !error && pageCount > 1 && (
          <nav
            aria-label="Пагинация"
            className="mt-10 flex items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Назад
            </button>
            <span className="text-sm text-slate-500">
              Страница <strong className="font-semibold text-slate-800">{currentPage}</strong>{' '}
              из {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= pageCount}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Вперед
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}
