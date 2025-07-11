'use client';

import { useGlobalContext } from "@/app/context/GlobalContext";
import ProductCard from "@/components/custom-ui/ProductCard";
import ProductFilter from "@/components/custom-ui/ProductFilter";
import TopBar from "@/components/custom-ui/TopBar";
import { SkeletonProductCard } from "@/components/skeletons/SkeletonProductCard";
import { Button } from "@/components/ui/button";
import { useFilterParams, useWebProducts } from "@/services/productServices";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useSelector } from "react-redux";

export default function Products({ params }) {
  const router = useRouter();
  const { cid, scid } = use(params);
  const { userId } = useSelector(state => state.auth);
  const queryClient = useQueryClient();
  const { setLoadingMain, searchQuery } = useGlobalContext();

  const tg = useTranslations('general');
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState('Popular');
  const [filters, setFilters] = useState({
  });

  const { data: productList, isLoading: productLoading } = useWebProducts({ pageSize: perPage, pageNumber: page, searchQuery, filters, id: cid, parentId: scid, sortBy: selectedSort.toLowerCase(), userId }, router);
  const { data: filterParamsData, isLoading: filterParamsDataLoading, isError: filterParamsDataError } = useFilterParams({ id: cid, parentId: scid, userId }, router)

  useEffect(() => {
    setLoadingMain(productLoading);
  }, [productLoading]);

  useEffect(() => {
    setPage(1)
  }, [filters]);

  useEffect(() => {
    queryClient.invalidateQueries(['webProducts']);
  }, [perPage, page, searchQuery, filters, selectedSort]);

  return (
    <div className="py-8 container grow flex flex-col">
      <p className="mb-5 text-gray-400">
        <span>Home</span> / <span>Fashion</span> / <span className="font-semibold text-black">All</span>
      </p>
      <TopBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} showFilter={showFilter} setShowFilter={setShowFilter} setSelectedSort={setSelectedSort} selectedSort={selectedSort} />
      <div className="flex gap-4 grow">
        <div className={`z-2 bg-white min-w-[200px] max-w-[200px] h-screen sm:h-auto fixed sm:static ${showFilter ? 'translate-x-0' : 'translate-x-[-110%] sm:translate-x-0'}`}>
          <ProductFilter onFilterChange={setFilters} cid={cid} scid={scid} filterParamsData={filterParamsData} />
        </div>
        <div className="relative z-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 grow">
          {productLoading ? (
            Array.from({ length: 8 }, (_, i) => <SkeletonProductCard key={i} />)
          ) : (
            <>
              {Array.isArray(productList?.products) && productList?.products?.length > 0 ? (
                productList?.products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-4">
                  <div className="text-center text-md text-gray-400 my-10 flex justify-center items-center rounded-xl bg-white">
                    {tg('noProducts')}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* pagination */}
      {productList?.totalPages > 1 && (
        <div className="flex justify-center my-6">
          <div className="flex gap-1 sm:gap-2">
            {/* Previous */}
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              className="!p-0 !min-w-8 !h-8"
            >
              <BsChevronLeft size={18} />
            </Button>

            {Array.from({ length: Math.min(5, productList?.totalPages) }, (_, i) => {
              let startPage = Math.max(1, page - 2);
              if (page + 2 > productList?.totalPages) startPage = Math.max(1, productList?.totalPages - 4);
              return startPage + i;
            })
              .filter(p => p >= 1 && p <= productList?.totalPages)
              .map(p => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                  className="!p-0 !min-w-8 !h-8"
                >
                  {p}
                </Button>
              ))}

            {/* Next */}
            <Button
              variant="outline"
              disabled={page >= productList?.totalPages}
              onClick={() => setPage(prev => Math.min(productList?.totalPages, prev + 1))}
              className="!p-0 !min-w-8 !h-8"
            >
              <BsChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

