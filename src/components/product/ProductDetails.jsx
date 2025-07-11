'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { meta } from '@turf/turf';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { useNotificationContext } from '@/app/context/ShowNotification';
import { useQueryClient } from '@tanstack/react-query';
import { useGlobalContext } from '@/app/context/GlobalContext';
import { useSelector } from 'react-redux';
import { is } from 'date-fns/locale';
import { handleError } from '@/utility/handleError';
import { formatIDRCustom } from '@/utility/general';


export default function ProductDetails({ productDetail }) {
    const router = useRouter();
    const { showNotification } = useNotificationContext();
    const queryClient = useQueryClient();
    const { setAuthType, setOpenAuthModal } = useGlobalContext();
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const { token } = useSelector(state => state.auth);

    const {
        products = {},
        productVarients = [],
        productVarientImages = [],
        defaultImagesAndColor = [],
        metaDataWithValues = [],
        descriptionColor = '',
        reviewList = [],
        reviews = [],
        recentViewedProductList = [],
        similarProductList = [],
        isWishlist = false,
        isAddedToCart = false,
    } = productDetail ?? {};

    const size = productVarients?.find((item) => item?.varients === 'Size')
    const color = productVarients?.find((item) => item?.varients === 'Color')



    const [selectedSizes, setSelectedSizes] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [readMore, setReadMore] = useState(false);
    const tg = useTranslations('general');
    const handleActionWithAuthCheck = (actionFn) => {
        if (!token) {
            setAuthType("isLoggedIn");
            setOpenAuthModal(true);
            return;
        }
        actionFn();
    };
    const handleAddToBag = async () => {
        try {
            if (isAddedToCart) {
                router.push('/cart');
                return;
            }
            setAddToCartLoading(true);

            const res = await api.post(`/api/Cart/AddToCart`, {
                productId: products?.id,
                variantId: products?.productVariantId,
                quantity: 1
            });
            if (res?.data?.isSuccess && res?.data?.statusCode === 200) {
                queryClient.invalidateQueries(['webProducts']);
                queryClient.invalidateQueries(['cartList']);
                queryClient.invalidateQueries(['wishList']);
                showNotification({
                    message: res.data.message,
                    variant: 'success',
                });
            } else {
                if (router && res?.data?.statusCode !== 200) {
                    handleError(res.data.statusCode, router);
                }
                showNotification({
                    message: res?.data?.message || 'Something went wrong',
                    variant: 'error',
                });
            }
        } catch (err) {
            const statusCode = err?.response?.status;
            if (router && statusCode) {
                handleError(statusCode, router);
            }
            showNotification({
                message: err?.response?.data?.message || 'Something went wrong',
                variant: 'error',
            });
        } finally {
            setAddToCartLoading(false);
        }
    };

    return (
        <div className="max-w-xl space-y-4">
            {/* Name and Price */}
            <h1 className="text-xl font-bold">{products?.name}</h1>
            <p className="text-primary text-xl font-semibold">{formatIDRCustom(products?.price, { withPrefix: true, decimalPlaces: 2 })}</p>

            {/* Reviews Placeholder */}
            {Array.isArray(reviewList) && reviewList.length > 0 && (
                <div className="flex items-center space-x-1 text-yellow-500">
                    <span>★★★★★</span>
                    <span className="text-gray-600 text-sm"><span className='font-semibold'>{reviewList[0].averageRating}</span> <span className='text-muted'>({reviewList[0].totalReviews} reviews)</span></span>
                </div>
            )}

            <hr className="my-4" />

            {/* Size Selector */}
            {Array.isArray(size?.values) && size?.values?.length > 0 && (

                <div>
                    <h3 className="font-semibold text-xl">
                        {tg("size")}
                    </h3>
                    <div className="flex space-x-2 mt-2 mb-5">
                        {size?.values?.map((size) => (
                            <Button
                                key={size?.productVariantId}
                                variant={'outline'}
                                className={`!px-3 h-6 text-xs !rounded-sm ${selectedSizes === size?.value ? 'border-primary !bg-primary !text-white' : ''
                                    }`}
                                onClick={() => setSelectedSizes(size?.value)}
                            >
                                {size?.value}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Color Selector */}
            {Array.isArray(color?.values) && color?.values?.length > 0 && (
                <div>
                    <h3 className="font-semibold text-xl">
                        Color
                    </h3>
                    <div className="flex space-x-2 mt-2 mb-5">
                        {color?.values?.map((color) => (
                            <div onClick={() => setSelectedColor(color?.value)} style={{ backgroundColor: color?.value }} key={color?.productVariantId} className={`${selectedColor === color?.value ? 'border-2 border-primary ' : 'border-2 border-black/40'} rounded-full w-6 h-6 `}>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Buttons */}
            <div className="flex gap-3 mb-6">
                <Button variant="outline" className="grow">Buy Now</Button>
                <Button disabled={addToCartLoading} onClick={() => handleActionWithAuthCheck(handleAddToBag)} className={`${isAddedToCart ? '!bg-green-600  !hover:bg-green-700 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} text-white grow`}>{addToCartLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : isAddedToCart ? 'Go to Cart' : 'Add to Cart'}</Button>
            </div>

            <hr className="my-4" />

            {/* Description Section */}
            <div>
                <h3 className="font-semibold text-base">Description</h3>

                <div className="mt-2 text-gray-700 space-y-1">
                    <p className='text-muted'><span className='w-[100px] inline-block text-gray-900'>Category:</span> {products?.categoryName}</p>
                    {metaDataWithValues?.map((metaData, index) => (
                        <p key={metaData?.id} className='text-muted'><span className='w-[100px] inline-block text-gray-900'>{metaData?.metaDatas}:</span> {metaData?.values}</p>
                    ))}
                    <p className='text-muted'><span className='w-[100px] inline-block text-gray-900'>Color:</span> {descriptionColor}</p>
                </div>

                <p className="text-gray-600 mt-2">
                    <span className={`${readMore ? '' : 'line-clamp-3'}`}>{products?.description}</span> <Button className="inline-block !p-0 h-auto" variant="link" onClick={() => { setReadMore(!readMore) }}>Read more</Button>
                </p>
            </div>
        </div>
    );
}
