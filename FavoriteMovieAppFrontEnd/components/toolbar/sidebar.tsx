import Sort, { SortSkeleton } from "./sort";
import Filters, { FiltersSkeleton } from "./filter/filters";
import BtnSkeleton from "../skeletons/btn-skeleton";
import ActionFilterSearch from "../clientActions/search/action-filter-search";

const SideBar = () => {
  return (
    <aside className="hidden md:block w-[320px]">
      <div className="space-y-4">
        <Filters />
        <Sort />
        <ActionFilterSearch />
      </div>
    </aside>
  );
};

export default SideBar;

export const SideBarSkeleton = () => {
  return (
    <aside className="hidden md:block w-[320px] bg-card rounded-xl">
      <div className="space-y-4">
        <FiltersSkeleton />
        <SortSkeleton />
        <BtnSkeleton />
      </div>
    </aside>
  );
};
