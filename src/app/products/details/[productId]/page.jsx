'use client';

import { useGlobalContext } from "@/app/context/GlobalContext";
import ProductDetails from "@/components/product/ProductDetails";
import ProductSlider from "@/components/product/ProductSlider";
import {  useProductDetails} from "@/services/productServices";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Products({ params }) {
  const router = useRouter();
  const { productId } = use(params);
  const { userId } = useSelector(state => state.auth.user);
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
  
const { data: productDetail, isLoading: isProductDetailsLoading } = useProductDetails({productId}, router);


  useEffect(()=>{
    queryClient.invalidateQueries(['productDetails']);
  }, []);

  useEffect(() => {
    queryClient.invalidateQueries(['webProducts']);

  }, [perPage, page, searchQuery, filters, selectedSort]);

  const productImages = [
    '/images/products/hijab-1.jpg',
    '/images/products/hijab-2.jpg',
    '/images/products/hijab-3.jpg',
    '/images/products/hijab-4.jpg'
  ];

  const productDetails = {
    id: 'adce6a4f-1671-42cc-ba4c-0fa6517c91e6',
    name: 'test Attribute Product1',
    price: 'Rp 500.00',
    discountPrice: '',
    description: 'test Attribute Product binding 1 test Attribute Product binding 1 test Attribute Product binding 1 test Attribute Product binding 1 test Attribute Product binding 1test Attribute Product binding 1 test Attribute Product binding 1 test Attribute Product binding 1 test Attribute Product binding 1 test Attribute Product binding 1 test Attribute Product binding 1 test Attribute Product binding 1',
    categoryName: 'Fashion',
    productTitle: 'Fashion / test Attribute Product1',
  };

  return (
    <div className="py-8 container">
      <p className="mb-5 text-gray-400">
        <span>Home</span> / <span>Fashion</span> / <span className="font-semibold text-black">All</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="col-span-1 sm:col-span-1 md:col-span-2">
          <ProductSlider images={productImages} productDetail={productDetail} />
        </div>
        <div className="col-span-1 sm:col-span-1 md:col-span-2">
          <ProductDetails productDetail={productDetail} />
        </div>
      </div>
    </div>
  );
}

