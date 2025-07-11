'use client';

import { debounce } from '@/utility/general';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { BsArrowDownUp, BsChevronDown, BsFilter } from 'react-icons/bs';

const sortOptions = ['Popular', 'Newest', 'Price: Lowest To Highest', 'Price: Highest to Lowest'];


export default function TopBar({ showFilter, setShowFilter, selectedSort, setSelectedSort, searchTerm, setSearchTerm }) {
    // const [selectedSort, setSelectedSort] = useState('Popular');
    const [showDropdown, setShowDropdown] = useState(false);
    const tg = useTranslations('general');
    const sortOptions2 = [
        {
            value: 'Popular',
            label: `${tg('popular')}`,
        },
        {
            value: 'Newest',
            label: `${tg('newest')}`,
        },
        {
            value: 'Price: Lowest To Highest',
            label: `${tg('priceLowToHigh')}`,
        },
        {
            value: 'Price: Highest to Lowest',
            label: `${tg('priceHighToLow')}`,
        },
    ];

    // const debouncedSetSearchTerm = useMemo(() => debounce((value) => {
    //     setSearchTerm(value);
    // }, 1000), [setSearchTerm]);

    // const handleSearchChange = (e) => {
    //     debouncedSetSearchTerm(e.target.value);
    // };

    return (
        <div className="flex justify-between items-center w-full mb-5">
            {/* Filter */}
            <button className="cursor-pointer flex items-center gap-2 text-lg font-semibold" onClick={() => setShowFilter(!showFilter)}>
                <BsFilter size={22} />
                {tg('filters')}
            </button>

            <div className="flex items-center gap-2 text-sm font-medium">
                {/* Search Bar */}
                {/* <input
                    type="text"
                    placeholder={tg('search')}
                    className="border border-gray-300 rounded-md px-2 py-1"
                    onChange={handleSearchChange}
                /> */}

                {/* Sort By */}
                <div className="relative text-sm font-medium">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2"
                    >
                        <BsArrowDownUp />
                        {tg('sortBy')} : <span className="font-semibold">
                            {sortOptions2.find(option => option.value === selectedSort)?.label}
                        </span>
                        <BsChevronDown className="ml-1" />
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow z-10">
                            {sortOptions2?.map(option => (
                                <button
                                    key={option?.label}
                                    onClick={() => {
                                        setSelectedSort(option?.value);
                                        setShowDropdown(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 font-normal ${selectedSort === option?.value ? 'font-semibold' : 'text-gray-500'}`}
                                >
                                    {option?.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

