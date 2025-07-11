import { useGlobalContext } from "@/app/context/GlobalContext";
import fbLogo from "@/public/icons/fb.svg";
import instaLogo from "@/public/icons/insta.svg";
import linkedInLogo from "@/public/icons/linkedin.svg";
import ytLogo from "@/public/icons/youtube.svg";
import locationIcon from "@/public/icons/location.svg";
import callIcon from "@/public/icons/call.svg";
import emailIcon from "@/public/icons/email.svg";
import { useTranslations } from "next-intl";
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
    const { areaGuideSlug } = useGlobalContext();

    const t = useTranslations('footer');
    const tg = useTranslations('general');

    return (
        <footer className="bg-gray-shade py-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-8 text-sm">

                {/* ONLINE SHOPPING & USEFUL LINKS */}
                <div className="col-span-1 sm:col-span-1">
                    <h4 className="font-semibold uppercase mb-3">{t('onlineShopping.title')}</h4>
                    <ul className="space-y-1 text-gray-500">
                        <li><Link href="#">{t('onlineShopping.fashion')}</Link></li>
                        <li><Link href="#">{t('onlineShopping.beauty')}</Link></li>
                        <li><Link href="#">{t('onlineShopping.glasses')}</Link></li>
                        <li><Link href="#">{t('onlineShopping.giftCards')}</Link></li>
                    </ul>
                    <h4 className="font-semibold uppercase mt-6 mb-3">{t('usefulLinks.title')}</h4>
                    <ul className="space-y-1 text-gray-500">
                        <li><Link href="#">{t('usefulLinks.blog')}</Link></li>
                        <li><Link href="#">{t('usefulLinks.careers')}</Link></li>
                    </ul>
                </div>

                {/* CUSTOMER POLICIES */}
                <div className="col-span-1 sm:col-span-1">
                    <h4 className="font-semibold uppercase mb-3">{t('customerPolicies.title')}</h4>
                    <ul className="space-y-1 text-gray-500">
                        <li><Link href="#">{t('customerPolicies.contactUs')}</Link></li>
                        <li><Link href="#">{t('customerPolicies.faqs')}</Link></li>
                        <li><Link href="#">{t('customerPolicies.terms')}</Link></li>
                        <li><Link href="#">{t('customerPolicies.trackOrders')}</Link></li>
                        <li><Link href="#">{t('customerPolicies.shipping')}</Link></li>
                        <li><Link href="#">{t('customerPolicies.cancellation')}</Link></li>
                        <li><Link href="#">{t('customerPolicies.returns')}</Link></li>
                        <li><Link href="#">{t('customerPolicies.privacy')}</Link></li>
                    </ul>
                </div>

                {/* APP & SOCIAL */}
                <div className="col-span-2 sm:col-span-3 lg:col-span-2 xl:col-span-3 order-4 lg:order-3 flex justify-center">
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-5">
                        <div>
                            <h4 className="font-semibold uppercase mb-3">{t('appExperience.title')}</h4>
                            <div className="flex gap-2">
                                <Image src="/images/google-store.png" alt="Google Play" className="h-10" width={150} height={40} />
                                <Image src="/images/apple-store.png" alt="App Store" className="h-10" width={150} height={40} />
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold uppercase mb-3">{t('keepInTouch')}</h4>
                            <div className="flex space-x-4 text-xl">
                                <Link href="#">
                                    <Image src={fbLogo} alt="Facebook" width={25} height={25} />
                                </Link>
                                <Link href="#">
                                    <Image src={instaLogo} alt="Instagram" width={25} height={25} />
                                </Link>
                                <Link href="#">
                                    <Image src={linkedInLogo} alt="LinkedIn" width={25} height={25} />
                                </Link>
                                <Link href="#">
                                    <Image src={ytLogo} alt="YouTube" width={25} height={25} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REACH US */}
                <div className="col-span-2 sm:col-span-1 lg:col-span-2 order-3 lg:order-4">
                    <h4 className="font-semibold uppercase mb-3">{t('reachUs.title')}</h4>
                    <div className="space-y-4 text-gray-500">
                        <div className="flex items-start gap-2">
                            <Image src={locationIcon} alt="Location" width={20} height={20} />
                            <p>{t('reachUs.address')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image src={callIcon} alt="Phone" width={20} height={20} />
                            <p>{t('reachUs.phone')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image src={emailIcon} alt="Email" width={20} height={20} />
                            <p>{t('reachUs.email')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

    );
}

export default Footer;