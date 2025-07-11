"use client";
import { useGlobalContext } from '@/app/context/GlobalContext';
import React, { useEffect } from 'react'

const Error404 = () => {
       const { setLoadingMain } = useGlobalContext();
       useEffect(() => {
            setLoadingMain(false);
       },[])

    return (
        <>
             <div className='flex items-center justify-center h-screen'>
                <div>
                    <h1 className='text-4xl text-center font-bold'>404</h1>
                    <h1 className='text-4xl text-center font-bold'>Page Not Found</h1>
                </div>
            </div>
        </>
    )
}

export default Error404