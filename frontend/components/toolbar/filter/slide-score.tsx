"use client";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useSearchFilterStore } from "@/store/store-filter-search";
import TitleSkeleton from "@/components/skeletons/title-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
type SliderProps = React.ComponentProps<typeof Slider>;

const SlideScore = ({ className, ...props }: SliderProps) => {
  const { scoreFrom, scoreTo, setScoreFrom, setScoreTo } =
    useSearchFilterStore();

  const handleChange = (newValue: number[]) => {
    const from = newValue[0].toString();
    const to = newValue[1].toString();
    setScoreFrom(from);
    setScoreTo(to);
  };
  const value = [Number(scoreFrom) || 0, Number(scoreTo) || 10];
  return (
    <div>
      <h2 className="my-2 font-semibold">User Score</h2>
      <p className="text-sm mb-2 text-center">
        Selected Score: {scoreFrom || "0"} - {scoreTo || "10"}
      </p>

      <Slider
        value={value}
        onValueChange={(newValue) => handleChange(newValue)}
        max={10}
        min={0}
        step={1}
        className={cn("w-full", className)}
        {...props}
      />
    </div>
  );
};

export default SlideScore;

export const SlideScoreSkeleton = () => {
  return (
    <div className="p-2">
      <div className="my-2">
        <TitleSkeleton />
      </div>
      <div className="grid items-center justify-center">
        <Skeleton className="mb-2 w-24 h-4 bg-gray-500" />
      </div>

      <Skeleton className="w-full h-2 bg-gray-500 rounded-full" />
    </div>
  );
};
