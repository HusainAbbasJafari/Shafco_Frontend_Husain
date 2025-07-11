'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LazyImage from '../LazyImage';
import { useTranslations } from 'use-intl';

const DiscoverCategories = ({ categories }) => {
    const t = useTranslations('home');
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <section className="py-10 px-4">
            <h2 className="text-2xl font-semibold mb-6 uppercase">{t('catH2')}</h2>
            <Slider {...settings}>
                {categories?.filter(item => item?.status).map((item, i) => (
                    <div key={item?.id} className="px-2">
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
                    </div>
                ))}
            </Slider>
        </section>
    );
};

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
    <div
        className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 bg-white border border-primary text-primary p-2 rounded-full cursor-pointer hover:bg-primary hover:text-white"
        onClick={onClick}
    >
        <FaChevronRight />
    </div>
);

const PrevArrow = ({ onClick }) => (
    <div
        className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-10 bg-white border border-primary text-primary p-2 rounded-full cursor-pointer hover:bg-primary hover:text-white"
        onClick={onClick}
    >
        <FaChevronLeft />
    </div>
);

export default DiscoverCategories;
