'use client';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from 'react-slick';
import { useTranslations } from 'use-intl';

const ExploreBrands = ({brands}) => {
      const t = useTranslations('home');
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 4 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 3 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 2 },
            },
        ],
    };

    return (
        <section className="py-10 px-4">
            <h2 className="text-2xl font-semibold mb-6 uppercase">{t('catH3')}</h2>
            <Slider {...settings}>
                {brands?.map((brand, i) => (
                    <div key={brand?.brandId } className="px-2">
                        <div className={`flex justify-center items-center aspect-[16/10] shadow-sm bg-gray-100 rounded-2xl overflow-hidden`}>
                            <img src={brand?.brandImage} alt={brand?.brandName} className='object-contain w-full h-full' />
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

export default ExploreBrands;
