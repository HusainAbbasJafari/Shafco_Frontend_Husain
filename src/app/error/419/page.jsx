"use client";

import { useGlobalContext } from '@/app/context/GlobalContext';
import React, { useEffect } from 'react'


const Error419 = () => {
    const { setLoadingMain } = useGlobalContext();
    useEffect(() => {
        setLoadingMain(false);
    }, [])
    return (
        <>
            <div className='flex items-center justify-center h-screen'>
                <div>
                    <h1 className='text-4xl text-center font-bold'>419</h1>
                    <h1 className='text-4xl text-center font-bold'>Page Expired</h1>
                </div>
            </div>
        </>
    )
}

export default Error419