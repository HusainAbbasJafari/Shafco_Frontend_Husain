"use client";

import searchIcon from "@/public/icons/search.svg";
import logoLg from "@/public/images/logo-lg.png";
import enFlag from "@/public/logo/en.svg";
import frFlag from "@/public/logo/fr.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { BiX } from "react-icons/bi";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import { useTranslations } from "next-intl";

import { useGlobalContext } from "@/app/context/GlobalContext";
import { useAllCategoriesList } from "@/services/productServices";
import { logout, setUserDetails } from "@/store/slices/authSlice";
import { setCatIds } from "@/store/slices/generalSlice";
import { CheckIcon } from "lucide-react";
import { BsChevronRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import ShafcoModal from "./ShafcoModal";
import ForgotPasswordModal from "./auth/ForgotPasswordModal";
import LoginModal from "./auth/LoginModal";
import OTPModal from "./auth/OTPModal";
import SetNewPasswordModal from "./auth/SetNewPasswordModal";
import SignupModal from "./auth/SignupModal";
import SuccessModal from "./auth/SuccessModal";
import SelectArrowDown from "./custom-ui/SelectArrowDown";
import { useNotificationContext } from "@/app/context/ShowNotification";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { debounce } from "@/utility/general";
import api from "@/services/api";
import { persistor } from "@/store/store";
import LogoutModal from "./auth/LogoutModal";
import IsLoggedInModal from "./auth/IsLoggedInModal";
import { set } from "nprogress";
import { useLoggedInUser } from "@/services/authServices";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "./ui/badge";

export default function Header() {
    const [isLoading, setIsLoading] = useState(false);
    const { showNotification } = useNotificationContext();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, token, userId } = useSelector(state => state.auth);

    const queryClient = useQueryClient();

    const { data: globalCategories } = useAllCategoriesList(router);
    const { seasonType, setSeasonType, setLanguage, language, setSearchQuery, authType, openAuthModal, setOpenAuthModal, setAuthType } = useGlobalContext();

    const { data: userDetails, isLoading: userDetailsLoading } = useLoggedInUser(userId, token, router);

    useEffect(() => {
        if (userDetails) {
            dispatch(setUserDetails(userDetails));
        }
    }, [userDetails]);
    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['allCategoriesList'] });
        queryClient.invalidateQueries({ queryKey: ['loggedInUser'] });
    }, []);

    const params = useParams();
    const cid = params?.cid;
    const scid = params?.scid;

    const [authEmail, setAuthEmail] = useState("");
    const t = useTranslations('header');
    const tg = useTranslations('general');
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [languageDrop, setLanguageDrop] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);
    let timeout = null;

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (scrolled) {
            document.body.classList.add("scrolled");
        } else {
            document.body.classList.remove("scrolled");
        }
    }, [scrolled]);

    useEffect(() => {
        // set default theme type
        if (typeof window !== 'undefined' && localStorage.getItem("theme_type") === "summer") {
            setSeasonType(true);
        } else if (typeof window !== 'undefined' && !localStorage.getItem("theme_type")) {
            const currentYear = new Date().getFullYear();
            const startDate = new Date(`April 20, ${currentYear}`).getTime();
            const endDate = new Date(`October 20, ${currentYear}`).getTime();
            const today = new Date().getTime();

            setSeasonType(today >= startDate && today <= endDate);
        } else {
            setSeasonType(false);
        }

        const handleScroll = () => {
            clearTimeout(timeout); // Clear previous timeout to prevent rapid updates

            if (window.scrollY > 122) {
                setScrolled(true);
            } else {
                timeout = setTimeout(() => {
                    setScrolled(false);
                }, 100); // Adjust debounce time if needed
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            clearTimeout(timeout); // Cleanup timeout
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const onLangChange = (newLang) => {
        setLanguage(newLang);
        setLanguageDrop(false);
        localStorage.setItem("lang", newLang);
        document.cookie = `NEXT_LOCALE=${newLang}; path=/`;
        router.refresh(); // This refresh happens only on user action
    };

    useEffect(() => {
        document.body.classList.toggle('summer', seasonType);
        localStorage.setItem("theme_type", seasonType ? "summer" : "winter");
    }, [seasonType]);

    const handleLoginModal = () => {
        setOpenAuthModal(true);
        setAuthType("login");
    };

    const handleLogout = async () => {
        setOpenAuthModal(true);
        setAuthType("logout");

    };


    const debouncedSetSearchTerm = useMemo(() => debounce((value) => {
        setSearchQuery(value);
    }, 1000), [setSearchQuery]);

    const handleSearchChange = (e) => {
        debouncedSetSearchTerm(e.target.value);
    };
    const handleWishListPage = () => {
        if (!token) {
            setOpenAuthModal(true);
            setAuthType("isLoggedIn");
        } else {
            router.push(`/wishlist`);
        }
    }
    const handleCartPage = () => {

        if (!token) {
            setOpenAuthModal(true);
            setAuthType("isLoggedIn");
        } else {
            router.push(`/cart`);
        }
    }

    return (
        <>
            <header
                className={`z-[49] relative w-full shadow-md transition-all duration-500 ${scrolled ? "is_sticky" : ""
                    }`}
            >
                {/* Main Navigation */}
                <nav className="bg-white z-[49] relative">
                    <div className="container mx-auto flex gap-2 lg:gap-4 items-center justify-between h-full">
                        <Link href="/" className="flex items-center space-x-2 min-w-[100px]">
                            <Image src={logoLg} alt="logo" height={70} />
                        </Link>

                        <div className="h-full flex gap-8 items-center justify-between relative">
                            <div className="hidden lg:flex space-x-4 h-full">
                                {globalCategories?.slice(0, 4)?.map((cat, i) => {
                                    return (
                                        <Popover key={cat?.id} open={openIndex === i}
                                            onOpenChange={(open) => setOpenIndex(open ? i : null)}>
                                            <PopoverTrigger asChild>
                                                <div
                                                    className={`h-[calc(100%-4px)] cursor-pointer flex items-center uppercase font-semibold px-2 pt-6 pb-5 hover:text-primary ${cat?.id === cid ? "text-primary" : ""}`}
                                                >
                                                    {cat?.categoryName}
                                                </div>
                                            </PopoverTrigger>

                                            <PopoverContent
                                                className="w-screen max-w-[120px] py-4 px-6 flex flex-col profileDrop !m-0 !rounded-none"
                                                align="center"
                                            >
                                                <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-10 h-[6px] bg-primary"></div>
                                                <div className="flex flex-col gap-3">
                                                    <Link
                                                        onClick={() => {
                                                            setOpenIndex(null);
                                                        }}
                                                        href={`/products/${cat?.id}/00000000-0000-0000-0000-000000000000`}
                                                        className={`font-medium hover:text-primary ${(cat?.id === cid && scid === "00000000-0000-0000-0000-000000000000") ? "text-primary" : ""}`}
                                                    >
                                                        All
                                                    </Link>

                                                    {cat?.childs?.map((subCat) => (
                                                        <Link
                                                            onClick={() => {
                                                                dispatch(setCatIds({ cid: cat?.id, scid: subCat?.id }));
                                                                setOpenIndex(null);
                                                            }}
                                                            href={`/products/${cat?.id}/${subCat?.id}`}
                                                            key={subCat?.id}
                                                            className={`font-medium hover:text-primary ${subCat?.id === scid ? "text-primary" : ""}`}
                                                        >
                                                            {subCat?.categoryName}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    )
                                })}
                            </div>

                            <div className="relative flex items-center w-6 md:w-xs lg:w-[200px] xl:w-xs mx-auto">
                                <Image src={searchIcon} className="cursor-pointer absolute left-3" alt="Search Icon" height={20} />

                                <Input
                                    className="hidden md:inline-block bg-gray-shade border-transparent text-sm !rounded-md pe-4 ps-10"
                                    id="name"
                                    type="text"
                                    placeholder={t("searchAnything")}
                                    // value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            <div className="h-full flex items-center gap-2 lg:gap-4">
                                <Popover open={languageDrop} onOpenChange={setLanguageDrop}>
                                    <PopoverTrigger asChild>
                                        <div className="uppercase bg-transparent !p-0 !border-0 !flex-grow [&>svg]:hidden !gap-1 flex items-center cursor-pointer">
                                            <Image
                                                className="min-w-5 w-5 me-[2px]"
                                                src={language === 'en' ? enFlag : frFlag}
                                                alt={language === 'en' ? "English" : "French"}
                                            />
                                            {language === 'en' ? "En" : 'Fr'}
                                            <SelectArrowDown />
                                        </div>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        align="end"
                                        sideOffset={8}
                                        className="!translate-x-[-40%] w-[130px] !p-1 overflow-y-auto"
                                    >
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => {
                                                    onLangChange('en');
                                                }}
                                                className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-sm"
                                            >
                                                <Image className="min-w-5 w-5 me-1" src={enFlag} alt="English" />
                                                {t("english")}

                                                {language === 'en' && (
                                                    <CheckIcon className="size-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onLangChange('fr');
                                                }}
                                                className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-sm"
                                            >
                                                <Image className="min-w-5 w-5 me-1" src={frFlag} alt="French" />
                                                {t("french")}

                                                {language === 'fr' && (
                                                    <CheckIcon className="size-4" />
                                                )}
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                <Popover open={profileDropdown} onOpenChange={setProfileDropdown}>
                                    <PopoverTrigger asChild>
                                        <div className="h-[90%] hover:text-primary cursor-pointer flex flex-col justify-center items-center">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.1333 9.05833C10.05 9.05 9.94999 9.05 9.85832 9.05833C7.87499 8.99167 6.29999 7.36667 6.29999 5.36667C6.29999 3.325 7.94999 1.66667 9.99999 1.66667C12.0417 1.66667 13.7 3.325 13.7 5.36667C13.6917 7.36667 12.1167 8.99167 10.1333 9.05833Z" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M5.96666 12.1333C3.95 13.4833 3.95 15.6833 5.96666 17.025C8.25833 18.5583 12.0167 18.5583 14.3083 17.025C16.325 15.675 16.325 13.475 14.3083 12.1333C12.025 10.6083 8.26666 10.6083 5.96666 12.1333Z" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="truncate text-xs mt-1 font-medium hidden xl:inline">{tg("profile")}</span>
                                        </div>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        className="w-screen max-w-[280px] translate-x-1/3 py-4 px-4 flex flex-col profileDrop !m-0 !rounded-none profileDrop"
                                        align="end"
                                    >
                                        <div className="absolute top-[-5px] left-1/2 translate-x-1/2 w-10 h-[6px] bg-primary"></div>

                                        {!token &&
                                            <div className="w-full">
                                                <h2 className="text-xl font-semibold">{tg("welcome")}</h2>
                                                <p className="text-sm text-gray-500 mt-1 mb-4">
                                                    {t("profileSubH1")}
                                                </p>
                                                <>
                                                    <button
                                                        onClick={handleLoginModal}
                                                        className="w-full border border-gray-300 rounded-lg py-3 text-primary font-semibold hover:bg-gray-100 transition mb-4">
                                                        {tg('login/signup')}
                                                    </button>
                                                    {/* <div className="flex justify-between items-center hover:text-primary cursor-pointer border-t border-b border-gray-300 py-3">
                                                        <span>{tg("myOrders")}</span>
                                                        <BsChevronRight className="text-primary" size={16} />
                                                    </div> */}
                                                </>
                                            </div>
                                        }

                                        <div className={token ? "block" : "hidden"}>
                                            <div className="pt-2 pb-4">
                                                <h4 className="text-lg">{tg('hello')}!</h4>
                                                <div className="flex justify-between items-center gap-2">
                                                    <h5 className="text-base font-semibold text-primary line-clamp-2 capitalize lh-1">{userDetails?.fullName}</h5>
                                                    <Link href="/profile" className="btn-primary border rounded-full text-sm !py-1 !px-2 text-nowrap">
                                                        {tg("viewProfile")}
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-300 flex flex-col gap-1 py-2">
                                                <Link
                                                    href="/"
                                                    className="text-link hover:text-primary rounded-md cursor-pointer"
                                                    onClick={() => setProfileDropdown(false)}
                                                >
                                                    {tg("myOrders")}
                                                </Link>
                                                <Link
                                                    href="/"
                                                    className="text-link hover:text-primary rounded-md cursor-pointer"
                                                    onClick={() => setProfileDropdown(false)}
                                                >
                                                    {tg("nearbyStores")}
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-300 flex flex-col gap-1 py-2">
                                                <Link
                                                    href="/"
                                                    className="text-link hover:text-primary rounded-md cursor-pointer"
                                                    onClick={() => setProfileDropdown(false)}
                                                >
                                                    {tg("loyaltyPoints")}
                                                </Link>
                                                <Link
                                                    href="/"
                                                    className="text-link hover:text-primary rounded-md cursor-pointer"
                                                    onClick={() => setProfileDropdown(false)}
                                                >
                                                    {tg("rewards")}
                                                </Link>
                                                <Link
                                                    href="/"
                                                    className="text-link hover:text-primary rounded-md cursor-pointer"
                                                    onClick={() => setProfileDropdown(false)}
                                                >
                                                    {tg("referAndEarn")}
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    className="text-link hover:text-primary rounded-md cursor-pointer"
                                                    onClick={() => setProfileDropdown(false)}
                                                >
                                                    {tg("settings")}
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-300 flex flex-col gap-1 py-2">
                                                <Link
                                                    href="/"
                                                    className="text-link hover:text-primary rounded-md cursor-pointer"
                                                    onClick={handleLogout}
                                                >
                                                    {isLoading ? "Logging out..." : tg("logout")}
                                                </Link>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                <div onClick={handleWishListPage} className="hover:text-primary cursor-pointer flex flex-col justify-center items-center">
                                    <div className="relative">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.5167 17.3417C10.2334 17.4417 9.76669 17.4417 9.48335 17.3417C7.06669 16.5167 1.66669 13.075 1.66669 7.24167C1.66669 4.66667 3.74169 2.58333 6.30002 2.58333C7.81669 2.58333 9.15835 3.31667 10 4.45C10.8417 3.31667 12.1917 2.58333 13.7 2.58333C16.2584 2.58333 18.3334 4.66667 18.3334 7.24167C18.3334 13.075 12.9334 16.5167 10.5167 17.3417Z" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {userDetails && <Badge className="absolute -top-1.5 -right-1.5" size="sm" >{userDetails?.wishlistItemCount}</Badge>}
                                    </div>

                                    <span className="truncate text-xs mt-1 font-medium hidden xl:inline">{tg("wishlist")}</span>
                                </div>
                                <div onClick={handleCartPage} className="relative hover:text-primary cursor-pointer flex flex-col justify-center items-center">
                                    <div className="relative">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.25 6.39167V5.58333C6.25 3.70833 7.75833 1.86667 9.63333 1.69167C11.8667 1.475 13.75 3.23333 13.75 5.425V6.575" stroke="currentcolor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M7.49998 18.3333H12.5C15.85 18.3333 16.45 16.9917 16.625 15.3583L17.25 10.3583C17.475 8.325 16.8916 6.66667 13.3333 6.66667H6.66664C3.10831 6.66667 2.52498 8.325 2.74998 10.3583L3.37498 15.3583C3.54998 16.9917 4.14998 18.3333 7.49998 18.3333Z" stroke="currentcolor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12.9129 10H12.9204" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M7.07878 10H7.08626" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {userDetails && <Badge className="absolute -top-1.5 -right-1.5" size="sm">{userDetails?.cartItemCount}</Badge>}
                                    </div>
                                    <span className="truncate text-xs mt-1 font-medium hidden xl:inline">{tg("bag")}</span>
                                </div>

                                <Drawer open={menuOpen} onOpenChange={setMenuOpen} direction="right">
                                    <DrawerTrigger asChild>
                                        <button aria-hidden="true" className="lg:hidden">
                                            <svg className="ms-2 lg:ms-4 w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                            </svg>
                                        </button>
                                    </DrawerTrigger>

                                    <DrawerContent>
                                        <div className="mx-auto w-full max-w-sm">
                                            <DrawerHeader className="px-3">
                                                <DrawerTitle></DrawerTitle>
                                                <DrawerDescription></DrawerDescription>
                                                <DrawerClose asChild>
                                                    <div className="flex justify-end">
                                                        <button aria-hidden="true" className="text-gray-500 hover:scale-125 transition-all hover:text-primary" onClick={() => setMenuOpen(false)}>
                                                            <BiX size={26} />
                                                        </button>
                                                    </div>
                                                </DrawerClose>
                                            </DrawerHeader>

                                            <div className="w-full px-3 pb-10 h-[calc(100vh-80px)] overflow-y-auto flex gap-6 flex-col justify-center items-center">
                                                <Link href="/" className="flex items-center">
                                                    <Image src={logoLg} alt="logo" height={120} />
                                                </Link>

                                                <Link href="/rent" className="block text-dark text-xl font-semibold hover:text-primary">{t('menu1')}</Link>
                                                <Link href="/rent" className="block text-dark text-xl font-semibold hover:text-primary">{t('menu2')}</Link>
                                                <Link href="/rent" className="block text-dark text-xl font-semibold hover:text-primary">{t('menu3')}</Link>
                                                <Link href="/rent" className="block text-dark text-xl font-semibold hover:text-primary">{t('menu4')}</Link>
                                            </div>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <ShafcoModal open={openAuthModal} logo={authType === "login" || authType === "signup"} onOpenChange={setOpenAuthModal}>
                {authType === "login" ? (
                    <LoginModal setOpenAuthModal={setOpenAuthModal} onSwitchTo={setAuthType} />
                ) : authType === "signup" ? (
                    <SignupModal setOpenAuthModal={setOpenAuthModal} onSwitchTo={setAuthType} />
                ) : authType === "forgot-password" ? (
                    <ForgotPasswordModal setOpenAuthModal={setOpenAuthModal} onSwitchTo={setAuthType} setAuthEmail={setAuthEmail} />
                ) : authType === "OTP" ? (
                    <OTPModal setOpenAuthModal={setOpenAuthModal} onSwitchTo={setAuthType} email={token ? user?.email : authEmail} />
                ) : authType === "set-new-password" ? (
                    <SetNewPasswordModal setOpenAuthModal={setOpenAuthModal} onSwitchTo={setAuthType} email={token ? user?.email : authEmail} />
                ) : authType === "success" ? (
                    <SuccessModal setOpenAuthModal={setOpenAuthModal} onSwitchTo={setAuthType} />
                ) : authType === "logout" ? (
                    <LogoutModal setOpenAuthModal={setOpenAuthModal} onSwitchTo={setAuthType} setProfileDropdown={setProfileDropdown} />
                ) : authType === "isLoggedIn" && (
                    <IsLoggedInModal setOpenAuthModal={setOpenAuthModal} onSwitchTo={setAuthType} setProfileDropdown={setProfileDropdown} />
                )}
            </ShafcoModal>
        </>
    );
};
