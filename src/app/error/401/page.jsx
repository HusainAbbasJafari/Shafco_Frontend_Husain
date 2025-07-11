"use client";
import { useGlobalContext } from '@/app/context/GlobalContext';
import React, { useEffect } from 'react'



const Error401 = () => {
    const { setLoadingMain } = useGlobalContext();
    useEffect(() => {
        setLoadingMain(false);
    }, [])
    return (
        <>
            <div className='flex items-center justify-center h-screen'>
                <div>
                    <h1 className='text-4xl text-center font-bold'>401</h1>
                    <h1 className='text-4xl text-center font-bold'>Unauthorized</h1>
                </div>
            </div>
        </>
    )
}

export default Error401