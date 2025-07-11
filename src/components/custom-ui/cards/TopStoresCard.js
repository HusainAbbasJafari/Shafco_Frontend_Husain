'use client';

import LazyImage from '../../LazyImage';

const TopStoresCard = ({ item }) => {

    return (
        <>
            <div className="px-2">
                <div className="text-center">
                    <div className="rounded-2xl overflow-hidden shadow-md image_animation aspect-[3/4]">
                        <LazyImage
                            src={item?.storeImage}
                            alt={item?.storeName || 'Untitled Store'}
                            className="object-cover w-full h-full"
                            isProduct={true}
                        />
                    </div>
                    <h3 className="mt-4 text-xl font-medium truncate">{item?.storeName}</h3>
                </div>
            </div>
        </>
    );
};

export default TopStoresCard;
