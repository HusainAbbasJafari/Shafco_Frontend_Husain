'use client';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { cn } from '@/lib/utils';
import LazyImage from '../LazyImage';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useNotificationContext } from '@/app/context/ShowNotification';
import { useGlobalContext } from '@/app/context/GlobalContext';
import api from '@/services/api';
import Image from "next/image";

export default function ProductSlider({ productDetail }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationContext();
  const { setAuthType, setOpenAuthModal } = useGlobalContext();

  const {
    products = {},
    productVarients = [],
    productVarientImages = [],
    defaultImagesAndColor = {},
    metaDataWithValues = [],
    descriptionColor = '',
    reviewList = [],
    reviews = [],
    recentViewedProductList = [],
    similarProductList = [],
    isWishlist = false,
    isAddedToCart = false,
  } = productDetail ?? {};
  const [activeIndex, setActiveIndex] = useState(0);
  // useEffect(() => setActiveIndex(0), [defaultImagesAndColor?.defaultImages]);
  const thumbnailSettings = {
    slidesToShow: Math.min(defaultImagesAndColor?.defaultImages?.length, 4),
    slidesToScroll: 1,
    vertical: true,
    focusOnSelect: false,
    arrows: false,
    infinite: false,
  };
  const { token } = useSelector(state => state.auth);
  const handleActionWithAuthCheck = (actionFn) => {
    if (!token) {
      setAuthType("isLoggedIn");
      setOpenAuthModal(true);
      return;
    }
    actionFn();
  };
  const handleModifyWishlist = async (action = "add") => {
    try {
      const res = await api.post(`/api/WishlistItem/ModifyWishlist`, {
        productId: products?.id,
        variantId: products?.productVariantId,
        action,
      });
      if (res?.data?.isSuccess && res?.data?.statusCode === 200) {
        queryClient.invalidateQueries(['webProducts']);
        queryClient.invalidateQueries(['cartList']);
        queryClient.invalidateQueries(['wishList']);
        showNotification({
          message: res.data.message,
          variant: "success",
        });
      } else {
        if (router && res?.data?.statusCode !== 200) {
          handleError(res.data.statusCode, router);
        }
        showNotification({
          message: res?.data?.message || "Something went wrong",
          variant: "error",
        });
      }
    } catch (err) {
      const statusCode = err?.response?.status;
      if (router && statusCode) {
        handleError(statusCode, router);
      }
      showNotification({
        message: err?.response?.data?.message || "Something went wrong",
        variant: "error",
      });
    }
  };


  return (
    <>
      {defaultImagesAndColor?.defaultImages?.length > 0 && (
        <>
          {(Array.isArray(defaultImagesAndColor.defaultImages) && defaultImagesAndColor.defaultImages.length > 1) ? (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-20">
                <Slider {...thumbnailSettings}>
                  {defaultImagesAndColor?.defaultImages?.map((img, idx) => (
                    <div key={img} className="mb-2">
                      <div
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                          'cursor-pointer rounded overflow-hidden',
                          activeIndex === idx
                            ? 'ring-2 ring-primary'
                            : 'ring-1 ring-gray-300'
                        )}
                      >
                        <Image
                          src={img}
                          alt={`thumbnail ${idx + 1}`}
                          width={80}
                          height={80}
                          className="object-cover rounded"
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>

              <div className="relative flex-1 rounded overflow-hidden">
                <LazyImage
                  src={defaultImagesAndColor?.defaultImages[activeIndex]}
                  alt={`main preview ${activeIndex + 1}`}
                  className="object-cover w-full h-auto"
                />
                <div className="rounded-full w-15 h-15 bg-black/40 absolute top-8 right-10 flex items-center justify-center">
                  {isWishlist ? (
                    <AiFillHeart onClick={() => handleActionWithAuthCheck(() => handleModifyWishlist("remove"))} className="text-primary text-xl group-hover:text-primary transition" size={35} />
                  ) : (
                    <AiOutlineHeart onClick={() => handleActionWithAuthCheck(() => handleModifyWishlist("add"))} className="text-white text-xl group-hover:text-primary transition" size={35} />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative flex-1 rounded overflow-hidden">
              <LazyImage
                src={defaultImagesAndColor?.defaultImages[0]}
                alt={defaultImagesAndColor?.defaultColor}
                className="object-cover w-full h-auto"
              />
              <div className="rounded-full w-15 h-15 bg-black/40 absolute top-8 right-10 flex items-center justify-center">
                {isWishlist ? (
                  <AiFillHeart onClick={() => handleActionWithAuthCheck(() => handleModifyWishlist("remove"))} className="text-primary text-xl group-hover:text-primary transition" size={35} />
                ) : (
                  <AiOutlineHeart onClick={() => handleActionWithAuthCheck(() => handleModifyWishlist("add"))} className="text-white text-xl group-hover:text-primary transition" size={35} />
                )}

              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
