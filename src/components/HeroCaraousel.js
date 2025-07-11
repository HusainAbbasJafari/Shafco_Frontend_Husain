"use client"
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const HeroCarousel = ({ children, renderButtons, styleType }) => {

    const sliderRef = useRef(null);
    const [settings, setSettings] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    const settings1 = {
        className: "slider",
        dots: false,
        infinite: true,
        speed: 500, // Reduce animation time for faster loading
        autoplay: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        // centerPadding: "100px",
        arrows: false,
        swipe: true,
        touchMove: true,
        responsive: [
            {
                breakpoint: 768, // Tablets & small screens
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480, // Mobile screens
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const settings2 = {
        centerMode: true,
        centerPadding: '100px',
        slidesToShow: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    };

    useEffect(() => {
        // Function to check and set mobile state
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 520);
        };

        // Initial check
        checkMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkMobile);

        // Cleanup event listener
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
        if (styleType === 2) {
            if (isMobile) {
                setSettings(settings1);
            } else {
                setSettings(settings2);
            }
        } else {
            setSettings(settings1);
        }
    }, [styleType, isMobile])

    return (
        <div className="relative">
            <Slider ref={sliderRef} {...settings} className='flex'>
                {children}
            </Slider>

            {renderButtons && renderButtons({ sliderRef })}
        </div>
    )
}

export default HeroCarousel