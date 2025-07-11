'use client';

import LazyImage from "@/components/LazyImage";
import Link from "next/link";

const CategoryCard = ({ item }) => {
    return (
        <Link href={`/products/${item?.id}/00000000-0000-0000-0000-000000000000`}>
            <div className="bg-[#313A3412] rounded-2xl p-6 text-center shadow-sm">
                <div className={`bg-white mx-auto rounded-full overflow-hidden flex items-center justify-center image_animation aspect-square`}>
                    <LazyImage
                        src={item?.categoryImage}
                        alt={item?.categoryName}
                        width={160}
                        className="object-contain"
                        isProduct={true}
                    />
                </div>
                <h3 className="mt-4 text-lg font-medium truncate">{item?.categoryName}</h3>
            </div>
        </Link>
    );
};

export default CategoryCard;

