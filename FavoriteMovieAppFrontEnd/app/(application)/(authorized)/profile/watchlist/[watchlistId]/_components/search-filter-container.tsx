import SearchListInput from "./search-list-input";
import SortList from "./sort-list";

const SearchFilterContainer = () => {
  return (
    <nav className="p-2  flex items-center justify-start md:justify-center flex-wrap gap-2  ">
      <SearchListInput />
      <SortList />
    </nav>
  );
};

export default SearchFilterContainer;
