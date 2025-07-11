import { Skeleton } from "@/components/ui/skeleton";
import { AiOutlineHeart } from 'react-icons/ai';
export function SkeletonProductCard() {
  return (
    <div className="relative mb-6">
      {/* Heart Icon Placeholder */}
      <div className="z-10 absolute top-3 right-3 bg-black/40 w-8 h-8 flex items-center justify-center rounded-full">
        <AiOutlineHeart className="text-white text-xl group-hover:text-primary transition" />
      </div>

      {/* Image Placeholder */}
      <Skeleton className="rounded-2xl w-full aspect-[4/5]" />

      {/* Text & Button Placeholder */}
      <div className="px-3 pt-2 text-center space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    </div>
  );
}
