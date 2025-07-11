'use client';

import LazyImage from "@/components/LazyImage";
import Link from "next/link";

const ItemCard = ({ item, type }) => {
    return (
        <div className={`relative bg-gray-100 text-center rounded-2xl overflow-hidden image_animation shadow-lg ${type === 1 && 'aspect-[4/5]'}`}>
            <div className={`img_wrap w-full h-full flex justify-center items-center overflow-hidden ${type === 2 && 'aspect-square bg-white'}`}>
                <LazyImage
                    src={item?.image}
                    alt={item?.name}
                    className="object-contain"
                    isProduct={true}
                />
            </div>

            {/* product tag */}
            {(type === 1 && item?.productTags) && (
                <span className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded-full shadow text-gray-700">
                    {item?.productTags}
                </span>
            )}

            {type === 2 && (
                <div className="p-4">
                    <h3 className="text-lg font-extrabold truncate">{item?.name}</h3>
                    <Link href={`/products/${item?.categorySlug}/${item?.slug}`} className="text-sm hover:text-primary mt-1 truncate">Explore All Products</Link>
                </div>
            )}
        </div>
    );
};

export default ItemCard;
