"use client"
import ProductCard from '@/components/custom-ui/ProductCard';
import { SkeletonProductCard } from '@/components/skeletons/SkeletonProductCard';
import { useWishList } from '@/services/cartServices';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const tg = useTranslations('general');

  const { data: wishList, isLoading: wishListLoading } = useWishList(router);

  useEffect(() => {
    queryClient.invalidateQueries(['wishList']);
  }, []);

  return (
    <div className='container p-10'>
      <div className='flex justify-between items-center gap-3 mb-6'>
        <h4 className="font-semibold text-2xl">{tg('mywishlist')}</h4>

        <span className='text-xl font-medium'> {wishList?.length} items </span>
      </div>

      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 grow">
        {wishListLoading ? (
          Array.from({ length: 8 }, (_, i) => <SkeletonProductCard key={i} />)
        ) : (
          <>
            {Array.isArray(wishList) && wishList?.length > 0 ? (
              wishList.map((product, index) => (
                <ProductCard key={`wishlist_item${index}`} product={product} />
              ))
            ) : (
              <div className="col-span-full">
                <div className="text-center text-md text-gray-400 my-10 flex justify-center items-center rounded-xl bg-white">
                  {tg('noProducts')}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>

  )
}

export default page