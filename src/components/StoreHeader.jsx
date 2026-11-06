const navigation = [
  { id: 'catalog', label: 'Главная' },
  { id: 'catalog', label: 'Каталог' },
  { id: 'wishlist', label: 'Избранное' },
  { id: 'cart', label: 'Корзина' },
];

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path strokeLinecap="round" d="m16 16 4 4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="8" r="3.25" />
      <path strokeLinecap="round" d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export default function StoreHeader({
  activeView,
  cartCount,
  onSearch,
  onViewChange,
  query,
  wishlistCount,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8">
        <nav
          aria-label="Основная навигация"
          className="order-2 flex w-full items-center justify-center gap-1 overflow-x-auto lg:order-1 lg:flex-1"
        >
          {navigation.map((item, index) => {
            const isActive = activeView === item.id && (
              item.id !== 'catalog' || index === 1
            );
            const count =
              item.id === 'wishlist'
                ? wishlistCount
                : item.id === 'cart'
                  ? cartCount
                  : 0;

            return (
              <button
                key={`${item.id}-${item.label}`}
                type="button"
                onClick={() => onViewChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {item.label}
                {count > 0 && (
                  <span className="grid min-w-5 place-items-center rounded-full bg-indigo-100 px-1 text-[11px] leading-5 text-indigo-700">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="order-1 ml-auto flex min-w-0 items-center gap-2 lg:order-2">
          <label className="relative min-w-0 flex-1 sm:w-52 sm:flex-none">
            <span className="sr-only">Поиск товаров</span>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Поиск товаров"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </label>
          <button
            type="button"
            aria-label="Профиль пользователя"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <UserIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
