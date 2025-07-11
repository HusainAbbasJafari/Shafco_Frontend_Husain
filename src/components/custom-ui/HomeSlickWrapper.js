"use client"
import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const HomeSlickWrapper = ({ children, title }) => {

    const sliderRef = useRef(null);

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
        <section className="py-8 px-4 custom_slider type_2">
            <h2 className="text-2xl font-semibold mb-6 uppercase">
                {title}
            </h2>
            <Slider ref={sliderRef} {...settings}>
                {children}
            </Slider>
        </section>
    )
}

export default HomeSlickWrapper