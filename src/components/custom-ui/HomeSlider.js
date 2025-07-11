import { getImageSrc } from "@/utility/general";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LazyImage from "../LazyImage";
import Link from "next/link";

export const HomeSlider = ({ item, isHome, isVideo, styleType }) => {
    // const t = useTranslations('HomePage');
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

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

    return (
        <div className="relative w-full flex items-center">
            <Link href={`#`} className={`z-1 grow ${(styleType === 2 && !isMobile) ? "px-1" : ''}`}>
                {isVideo ?
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`w-full object-cover aspect-[16/6] max_h_full`}
                    >
                        <source src={getImageSrc(isHome ?  item.filePath :  item.filePath)} type="video/mp4" />
                    </video>
                    :
                    <LazyImage
                        src={isHome ? item.filePath : item.filePath}
                        alt={item.title ? item.title : 'offer-banner'}
                        className={`w-full object-cover object-left aspect-[16/6] max_h_full`}
                    />
                }
            </Link>
        </div>
    );
}