const NotFound = () => {
    return (
        <div className="py-20">
            <div className="max-w-xl mx-auto w-full">
                <div className="md:flex flex-col justify-center items-center text-center">
                    {/* Illustration Section */}
                    <div className="w-full h-30 p-3 flex items-center justify-center">
                        <div className="relative w-64 h-64">
                            <div className="absolute inset-0 flex items-center justify-center text-primary">
                                <svg 
                                    className="w-30 h-30 md:w-30 md:h-30 animate-bounce" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                                        stroke="currentColor"
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                    <path 
                                        d="M12 8V12" 
                                        stroke="currentColor"
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                    <path 
                                        d="M12 16H12.01" 
                                        stroke="currentColor"
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full">
                        <div className="mb-8">
                            <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-4">
                                404 ERROR
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                Page Not Found
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Oops! The page you're looking for doesn't exist or has been moved. 
                                Try searching or go back to our homepage.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;