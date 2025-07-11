import Image from 'next/image';
import LazyImage from '../LazyImage';
import { useTranslations } from 'use-intl';

const categories = [
    {
        title: 'Skincare',
        image: '/images/skincare.png',
    },
    {
        title: 'Make-Up',
        image: '/images/makeup.png',
    },
    {
        title: 'Haircare',
        image: '/images/haircare.png',
    },
    {
        title: 'Fragrance',
        image: '/images/fragrance.png',
    },
];

const BeautyPicks = ({ topBeautyPicks }) => {
    const t = useTranslations('home');
    return (
        <section className="py-10 px-4">
            <h2 className="text-2xl font-semibold mb-6 uppercase">{t('catH5')}</h2>
            <div className="flex flex-wrap -mx-2">
                {topBeautyPicks?.map((item, i) => (
                    <div
                        key={i}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-6 flex justify-center"
                    >
                        <div className="w-full max-w-xs flex flex-col items-center">
                            <div className="rounded-2xl overflow-hidden shadow-md image_animation aspect-[3/4]">
                                <LazyImage
                                    src={item?.categoryImage}
                                    alt={item?.categoryName || "beauty picks"}
                                    className="object-contain"
                                    isProduct={true}
                                />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-center truncate">{item?.categoryName}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BeautyPicks;
