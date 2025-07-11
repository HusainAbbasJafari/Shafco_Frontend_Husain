'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useFilterParams } from "@/services/productServices";
import { formatIDRCustom } from "@/utility/general";
import { useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "use-intl";
import { Label } from "../ui/label";


export default function ProductFilter({ onFilterChange, cid, scid, filterParamsData }) {
    const tg = useTranslations('general');
    const router = useRouter();
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColorIds, setSelectedColorIds] = useState([]);
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries(['filterParams']);
    }, [filterParamsData])

    const toggleSize = (size) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const toggleBrand = (brand) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    const toggleColor = (id) => {
        setSelectedColorIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    // const [priceRange, setPriceRange] = useState([
    //     parseInt(filterParamsData?.fromPrice) || 0,
    //     parseInt(filterParamsData?.toPrice) || filterParamsData?.maxPrice || 10000,
    // ]);

    const [priceRange, setPriceRange] = useState([
        0, filterParamsData?.maxPrice > 10000 ? filterParamsData?.maxPrice : 10000,
    ]);

    const handlePriceRangeChange = (newRange) => {
        setPriceRange(newRange);
    };

    useEffect(() => {
        const payload = {
            fromPrice: priceRange[0],
            toPrice: priceRange[1],
            sizeParams: selectedSizes && selectedSizes.length > 0 ? selectedSizes : [],
            brandIdParams: selectedBrands && selectedBrands.length > 0 ? selectedBrands : [],
            colorParams: selectedColorIds && selectedColorIds.length > 0 ? selectedColorIds.map(String) : [],
        };

        const debouncedOnFilterChange = debounce((payload) => {
            if (onFilterChange) {
                onFilterChange(payload);
            }
        }, 500); // Adjust delay as needed

        debouncedOnFilterChange(payload);

        return () => {
            debouncedOnFilterChange.cancel();
        };
    }, [priceRange, selectedSizes, selectedBrands, selectedColorIds, onFilterChange]);

    return (
        <aside className="w-full max-w-[240px] border p-4 space-y-6">
            {/* Price Range */}
            <div className="space-y-2">
                <h3 className="font-semibold text-sm">{tg('priceRange')}</h3>
                <div className="flex justify-between text-xs text-gray-600">
                    <span>{formatIDRCustom(parseInt(priceRange[0]), { withPrefix: true, decimalPlaces: 0 })}</span>
                    <span>{formatIDRCustom(parseInt(priceRange[1]), { withPrefix: true, decimalPlaces: 0 })}</span>
                </div>

                <Slider
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    min={0}
                    max={filterParamsData?.maxPrice > 10000 ? parseInt(filterParamsData?.maxPrice) : 10000}
                    step={100}
                />

                {/* min={(filterParamsData?.minPrice > 1 && (filterParamsData?.minPrice < filterParamsData?.maxPrice)) ? parseInt(filterParamsData?.minPrice) : 1} */}
            </div>

            {/* Colours */}
            {
                filterParamsData?.colorList?.length > 0 &&
                <div className="space-y-2">
                    <h3 className="font-semibold text-sm">{tg('colors')}</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {filterParamsData?.colorList?.map((color) => (
                            <button
                                key={color?.id}
                                onClick={() => toggleColor(color?.value)}
                                className={`w-7 h-7 rounded-full relative flex items-center justify-center border border-gray-100 ${selectedColorIds.includes(color?.value) ? 'border-primary p-[2px]' : ''
                                    } transsition-all duration-200`}
                            >
                                <span className="rounded-full w-full h-full" style={{ backgroundColor: color?.value }} />
                            </button>
                        ))}
                    </div>
                </div>
            }
            {/* Size */}
            {
                filterParamsData?.sizeList?.length > 0 &&
                <div className="space-y-2">
                    <h3 className="font-semibold text-sm">
                        {tg("size")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {filterParamsData?.sizeList?.map((size) => (
                            <Button
                                key={size?.id}
                                variant={'outline'}
                                className={`!px-3 h-6 text-xs !rounded-sm ${selectedSizes.includes(size?.value) ? 'border-primary !bg-primary !text-white' : ''
                                    }`}
                                onClick={() => toggleSize(size?.value)}
                            >
                                {size?.value}
                            </Button>
                        ))}
                    </div>
                </div>
            }

            {/* Brands */}
            {
                filterParamsData?.brandList?.length > 0 &&
                <div className="space-y-2">
                    <h3 className="font-semibold text-sm">{tg('brands')}</h3>
                    <div className="space-y-2">
                        {filterParamsData?.brandList?.map((brand) => (
                            <div key={brand?.id} className="flex items-center gap-2">
                                <Checkbox
                                    id={brand?.id}
                                    checked={selectedBrands.includes(brand?.id)}
                                    onCheckedChange={() => toggleBrand(brand?.id)}
                                    className={selectedBrands.includes(brand?.id) ? 'bg-primary border-primary' : ''}
                                />
                                <Label htmlFor={brand} className="text-sm">{brand?.value}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </aside>
    );
}

