import { Search as SearchIcon } from "lucide-react";
import { Button } from "../ui/button";

import Search from ".";
import { useToggleSearchInput } from "@/store/store";

const SearchOpen = () => {
  const { isOpen, toggle } = useToggleSearchInput();
  return (
    <>
      {isOpen ? (
        <Search />
      ) : (
        <Button onClick={() => toggle()} size={"sm"} variant={"ghost"}>
          <SearchIcon />
        </Button>
      )}
    </>
  );
};

export default SearchOpen;
