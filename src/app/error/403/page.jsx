"use client";
import { useGlobalContext } from '@/app/context/GlobalContext';
import React, { useEffect } from 'react'


const Error403 = () => {
    const { setLoadingMain } = useGlobalContext();
    useEffect(() => {
        setLoadingMain(false);
    }, [])
    return (
        <>
            <div className='flex items-center justify-center h-screen'>
                <div>
                    <h1 className='text-4xl text-center font-bold'>403</h1>
                    <h1 className='text-4xl text-center font-bold'>Forbidden</h1>
                </div>
            </div>
        </>
    )
}

export default Error403