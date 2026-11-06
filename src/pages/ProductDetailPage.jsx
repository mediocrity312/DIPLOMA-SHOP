import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getProduct } from '../api/productsApi.js';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function fetchProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getProduct(id);
        if (isCurrent) setProduct(data);
      } catch (requestError) {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message ??
              requestError.message ??
              'Не удалось загрузить товар',
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    fetchProduct();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  const discountedPrice = product
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;
  const images = product?.images?.length
    ? product.images
    : product?.thumbnail
      ? [product.thumbnail]
      : [];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
      <Link
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-700 transition hover:text-indigo-900"
        to="/"
      >
        <span aria-hidden="true">←</span> Назад к каталогу
      </Link>
      {isLoading && (
        <p role="status" className="py-16 text-center text-slate-500">
          Загрузка товара...
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl bg-rose-50 p-4 text-rose-700">
          {error}
        </p>
      )}
      {product && (
        <article className="grid items-start gap-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-2 lg:gap-12 lg:p-10">
          <div className="min-w-0 overflow-hidden rounded-2xl bg-slate-50">
            {images.length > 0 ? (
              <Swiper
                modules={[A11y, Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={16}
                slidesPerView={1}
                className="product-gallery"
                aria-label={`Изображения товара ${product.title}`}
              >
                {images.map((image, index) => (
                  <SwiperSlide
                    key={`${image}-${index}`}
                    className="!flex !h-[min(60vh,520px)] !items-center !justify-center"
                  >
                    <img
                      src={image}
                      alt={`${product.title} — фото ${index + 1}`}
                      className="h-full w-full object-contain p-8"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="p-8 text-sm text-slate-500">
                Изображения товара отсутствуют.
              </p>
            )}
          </div>
          <div className="py-2 lg:py-5">
            <p className="mb-3 text-sm font-medium capitalize text-indigo-600">
              {product.category}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-5 leading-7 text-slate-600">{product.description}</p>
            <div className="mt-7 flex flex-wrap items-baseline gap-3">
              <strong className="text-3xl font-semibold tracking-tight text-indigo-700">
                ${discountedPrice}
              </strong>
              <del className="text-base text-slate-400">
                ${product.price.toFixed(2)}
              </del>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                В наличии: {product.stock}
              </span>
            </div>
            <p className="mt-5 text-sm text-slate-500">
              Рейтинг: <span className="font-medium text-slate-700">{product.rating} / 5</span>
            </p>
          </div>
        </article>
      )}
      </div>
    </main>
  );
}
