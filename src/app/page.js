"use client";
import HeroCarousel from "@/components/HeroCaraousel";
import BeautyPicks from "@/components/custom-ui/BeautyPicks";
import DiscoverCategories from "@/components/custom-ui/DiscoverCategories";
import ExploreBrands from "@/components/custom-ui/ExploreBrands";
import HomeSlickWrapper from "@/components/custom-ui/HomeSlickWrapper";
import { HomeSlider } from "@/components/custom-ui/HomeSlider";
import SlickButton from "@/components/custom-ui/SlickButton";
import ItemCard from "@/components/custom-ui/cards/ItemCard";
import TopStoresCard from "@/components/custom-ui/cards/TopStoresCard";
import { useDashboard } from "@/services/productServices";
import { setCategories } from "@/store/slices/generalSlice";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGlobalContext } from "./context/GlobalContext";
import TopBeautyCard from "@/components/custom-ui/cards/TopBeautyCard";
import { useRouter } from "next/navigation";
import { useTranslations } from "use-intl";
import { homeBannerData } from "@/utility/data";
import CategoryCard from "@/components/custom-ui/cards/CategoryCard";



export default function Home() {
  const t = useTranslations('home');

  const router = useRouter();
  const { data: dashboard, isLoading: dashboardLoading, isError } = useDashboard(router);
  const categoriesData = dashboard?.categories;
  const dispatch = useDispatch();
  const { homeLoading, setHomeLoading, seasonType, setLoadingMain, loadingMain } = useGlobalContext();
  const queryClient = useQueryClient();


  useEffect(() => {
    queryClient.invalidateQueries(['dashboard']);
  }, [])

  useEffect(() => {
    setLoadingMain(dashboardLoading);
  }, [dashboardLoading])

  useEffect(() => {
    if (dashboard) {
      dispatch(setCategories(dashboard?.categories));
    }
  }, [dashboard])


  return (
    <>
      <section className="relative">
        {homeBannerData && homeBannerData.length > 1 && (
          <HeroCarousel
            key="home_banner" // Force remount
            renderButtons={({ sliderRef }) => (
              <SlickButton className="hidden md:flex min-w-10 w-10" sliderRef={sliderRef} iconSize={18} type="type_2" />
            )}
          >
            {homeBannerData?.map((item, index) => (
              <HomeSlider
                key={index}
                item={item}
                isHome={true}
                isVideo={
                  typeof item.image === 'string' &&
                  (item.image.endsWith('.mp4') || item.image.endsWith('.mov'))
                }
              />
            ))}
          </HeroCarousel>
        )}

        {homeBannerData && homeBannerData.length === 1 && (
          <HomeSlider
            key={seasonType ? 'summer-single' : 'winter-single'}
            item={homeBannerData[0]}
            isHome={true}
            isVideo={
              typeof homeBannerData[0]?.image === 'string' &&
              (homeBannerData[0]?.image.endsWith('.mp4') || homeBannerData[0]?.image.endsWith('.mov'))
            }
          />
        )}

      </section>

      <section>
        <div className="container py-5">
          {dashboard?.topPicks && (
            <HomeSlickWrapper key="topPicks" title={t('catH1')}>
              {dashboard?.topPicks?.map((item, index) => (
                <div key={index} className="px-2 py-4">
                  <ItemCard item={item} type={1} />
                </div>
              ))}
            </HomeSlickWrapper>
          )}

          {dashboard?.categories && (
            <HomeSlickWrapper key="topCategories" title={t('catH2')}>
              {dashboard?.categories?.map((item, index) => (
                <div key={index} className="px-2 py-4">
                  <CategoryCard item={item} />
                </div>
              ))}
            </HomeSlickWrapper>
          )}

          {dashboard?.brands && (
            <ExploreBrands brands={dashboard?.brands} />
          )}

          {dashboard?.stores && (
            <HomeSlickWrapper key="topStores" title={t('catH4')}>
              {dashboard?.stores?.map((item, index) => (
                <div key={index} className="px-2 py-4">
                  <TopStoresCard item={item} type={1} />
                </div>
              ))}
            </HomeSlickWrapper>
          )}

          {dashboard?.topBeautyPicks && (
            <HomeSlickWrapper key="topBeautyPicks" title={t('catH5')}>
              {dashboard?.topBeautyPicks?.map((item, index) => (
                <div key={index} className="px-2 py-4">
                  <TopBeautyCard item={item} type={1} />
                </div>
              ))}
            </HomeSlickWrapper>
          )}

          {dashboard?.accessories && (
            <HomeSlickWrapper key="topAccessories" title={t('catH6')}>
              {dashboard?.accessories?.map((item, index) => (
                <div key={index} className="px-2 py-4">
                  <ItemCard item={item} type={2} />
                </div>
              ))}
            </HomeSlickWrapper>
          )}
        </div>
      </section>
    </>
  );
}
