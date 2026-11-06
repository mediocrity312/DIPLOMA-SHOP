import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

export async function getProducts({ limit, skip, sortBy, order, query }) {
  const { data } = await api.get(query ? '/products/search' : '/products', {
    params: { limit, skip, sortBy, order },
    ...(query ? { params: { limit, skip, sortBy, order, q: query } } : {}),
  });

  return data;
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}
