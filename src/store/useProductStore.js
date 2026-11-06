import { create } from 'zustand';
import { getProducts } from '../api/productsApi.js';

export const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  limit: 12,
  skip: 0,
  total: 0,
  sortBy: 'price',
  order: 'desc',
  query: '',

  fetchProducts: async (params = {}) => {
    const requestParams = {
      limit: params.limit ?? get().limit,
      skip: params.skip ?? get().skip,
      sortBy: params.sortBy ?? get().sortBy,
      order: params.order ?? get().order,
      query: params.query ?? get().query,
    };

    set({ ...requestParams, isLoading: true, error: null });

    try {
      const data = await getProducts(requestParams);
      set({
        products: data.products,
        total: data.total,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ??
          error.message ??
          'Не удалось загрузить товары',
        isLoading: false,
      });
    }
  },

  setPage: (page) => {
    const { limit, fetchProducts } = get();
    return fetchProducts({ skip: (page - 1) * limit });
  },

  setSort: (sortBy, order) => get().fetchProducts({ sortBy, order, skip: 0 }),
  setSearch: (query) => get().fetchProducts({ query, skip: 0 }),
}));
