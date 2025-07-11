'use client';

import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
    const [loadingMain, setLoadingMain] = useState(false); // example state
    const [homeLoading, setHomeLoading] = useState(false); // example state
    const [seasonType, setSeasonType] = useState(); // example state
    const [areaGuideSlug, setAreaGuideSlug] = useState(''); // example state
    const [language, setLanguage] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [authType, setAuthType] = useState("");// login, signup, forgotPassword, otp, setNewPassword, success,isLoggedIn
    const [openAuthModal, setOpenAuthModal] = useState(false);

    return (
        <GlobalContext.Provider
            value={{
                loadingMain,
                setLoadingMain,
                homeLoading,
                setHomeLoading,
                seasonType,
                setSeasonType,
                areaGuideSlug,
                setAreaGuideSlug,
                language,
                setLanguage,
                setSearchQuery,
                searchQuery,
                authType,
                setAuthType,
                openAuthModal,
                setOpenAuthModal
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobalContext() {
    return useContext(GlobalContext);
}
