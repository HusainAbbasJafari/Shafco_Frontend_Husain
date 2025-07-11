'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import LazyImage from '../LazyImage';
import { Button } from '../ui/button';
import { formatIDRCustom } from '@/utility/general';
import Link from 'next/link';
import { useNotificationContext } from '@/app/context/ShowNotification';
import api from '@/services/api';
import { handleError } from '@/utility/handleError';
import { useGlobalContext } from '@/app/context/GlobalContext';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';


const ProductCard = ({ product }) => {
    const { showNotification } = useNotificationContext();
    const queryClient = useQueryClient();
    const router = useRouter();
    const [isFavorited, setIsFavorited] = useState(false);
    const { authType, setAuthType, openAuthModal, setOpenAuthModal } = useGlobalContext();
    const { token } = useSelector(state => state.auth);

    const toggleFavorite = () => {
        setIsFavorited(prev => !prev);
    };
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
                productId: product?.id,
                variantId: product?.productVariantId,
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

    const handleAddToBag = async () => {
        try {
            const res = await api.post(`/api/Cart/AddToCart`, {
                productId: product?.id,
                variantId: product?.productVariantId,
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
                    handleError(res.data.statusCode, router); // Optional routing
                }
                showNotification({
                    message: res?.data?.message || 'Something went wrong',
                    variant: 'error',
                });
            }
        } catch (err) {
            const statusCode = err?.response?.status;
            if (router && statusCode) {
                handleError(statusCode, router); // Optional routing
            }
            showNotification({
                message: err?.response?.data?.message || 'Something went wrong',
                variant: 'error',
            });
        }
    };

    return (
        <div className="relative mb-6">
            <button
                type='button'
                onClick={toggleFavorite}
                className="z-10 group absolute top-3 right-3 bg-black/40 w-8 h-8 flex items-center justify-center rounded-full"
            >
                {product?.isWishList ? (

                    <AiFillHeart onClick={() => handleActionWithAuthCheck(() => handleModifyWishlist("remove"))} className="text-primary text-xl" />
                ) : (
                    <AiOutlineHeart onClick={() => handleActionWithAuthCheck(() => handleModifyWishlist("add"))} className="text-white text-xl group-hover:text-primary transition" />
                )}
            </button>

            <Link className='flex flex-col gap-2 mb-2' href={`/products/details/${product.id}`}>
                <div className="rounded-2xl overflow-hidden shadow-md image_animation aspect-[4/5]">
                    <LazyImage src={product?.image} alt={product?.name} className="w-full h-full object-cover object-top" isProduct={true} />
                </div>

                <div className="text-center px-1">
                    <h3 className="text-sm font-medium truncate captialize">{product?.name}</h3>
                    <p className="text-sm font-semibold">{formatIDRCustom(product?.price, { withPrefix: true, decimalPlaces: 2 })}</p>
                </div>
            </Link>

            <Button onClick={() => handleActionWithAuthCheck(handleAddToBag)} className={`${product?.isCartList ? "!bg-green-600" : "!bg-primary"} w-full`}>
                {product?.isCartList ? "Added " : "Add to Bag"}
            </Button>
        </div>
    );
};

export default ProductCard;
