'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LazyImage from '../LazyImage';
import { useTranslations } from 'use-intl';

const TopPicks = ({ topPicks }) => {

    const t = useTranslations('home');
    const images = [
        { src: '/images/pick1.png', label: 'Trending' },
        { src: '/images/pick2.png' },
        { src: '/images/pick3.png' },
        { src: '/images/pick4.png' },
    ];

    const settings = {
        className: "slider",
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        centerMode: false,
        arrows: true,
        swipe: true,
        touchMove: true,
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
        <section className="py-8 px-4">
            <h2 className="text-2xl font-semibold mb-6 uppercase">{t('catH1')}</h2>
            <Slider {...settings}>
                {topPicks?.map((item, index) => (
                    <div key={item?.topPicksId} className="px-2">
                        <div className="relative rounded-2xl overflow-hidden image_animation shadow-lg aspect-[4/5]">
                            <div className="img_wrap w-full h-full flex justify-center items-center">
                                <LazyImage
                                    src={item?.image}
                                    alt={item?.name}
                                    className="object-cover w-full"
                                />
                            </div>
                            {item?.name && (
                                <span className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded-full shadow text-gray-700">
                                    {item?.name}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
};

// Custom Arrow Components
const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 bg-white border border-primary text-primary p-2 rounded-full cursor-pointer hover:bg-primary hover:text-white"
            onClick={onClick}
        >
            <FaChevronRight />
        </div>
    );
};

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-10 bg-white border border-primary text-primary p-2 rounded-full cursor-pointer hover:bg-primary hover:text-white"
            onClick={onClick}
        >
            <FaChevronLeft />
        </div>
    );
};

export default TopPicks;
