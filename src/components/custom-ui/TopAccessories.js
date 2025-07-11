'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LazyImage from '../LazyImage';
import Link from 'next/link';
import { useTranslations } from 'use-intl';

const brands = [
    {
        name: 'RAY-BAN',
        img: '/images/brands/rayban.png',
    },
    {
        name: 'DOLCE & GABBANA',
        img: '/images/brands/dolcegabbana.png',
    },
    {
        name: 'BURBERRY',
        img: '/images/brands/burberry.png',
    },
    {
        name: 'PRADA',
        img: '/images/brands/prada.png',
    },
];

const TopAccessories = ({ accessories }) => {
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
            <h2 className="text-2xl font-bold mb-6 uppercase">{t('catH6')}</h2>
            <Slider {...settings}>
                {accessories?.map((item, i) => (
                    <div key={item?.id} className="px-2">
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden text-center">
                            <div className="overflow-hidden image_animation bg-gray-100 aspect-[1/1]">
                                <LazyImage
                                    src={item?.image}
                                    alt={item?.name}
                                    className="w-full h-full object-cover object-top"
                                    isProduct={true}
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-extrabold truncate">{item?.name}</h3>
                                <Link href={"/"} className="text-sm hover:text-primary mt-1 truncate">Explore All Products</Link>
                            </div>
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

export default TopAccessories;
