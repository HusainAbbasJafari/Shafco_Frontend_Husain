'use client';

import LazyImage from '../../LazyImage';

const TopBeautyCard = ({ item }) => {

    return (
        <div className="text-center">
            <div className="rounded-2xl overflow-hidden shadow-md image_animation aspect-[3/4] flex justify-center items-center">
                <LazyImage
                    src={item?.categoryImage}
                    alt={item?.categoryName || 'Untitled Store'}
                    className="object-contain"
                    isProduct={true}
                />
            </div>
            <h3 className="mt-4 text-xl font-medium truncate">{item?.categoryName}</h3>
        </div>
    );
};

export default TopBeautyCard;
