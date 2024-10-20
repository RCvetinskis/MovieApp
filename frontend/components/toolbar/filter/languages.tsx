"use client";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Language } from "@/types";
import { useSearchFilterStore } from "@/store/store-filter-search";
import TitleSkeleton from "@/components/skeletons/title-skeleton";
import InputSkeleton from "@/components/skeletons/input-skeleton";

type Props = {
  data: Language[] | [];
};
const Languages = ({ data }: Props) => {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useSearchFilterStore();
  const selectedLanguageIso = (englishName: string): string => {
    const foundLanguage = data.find(
      (item) => item.english_name === englishName
    );

    return foundLanguage ? foundLanguage.iso_639_1 : "";
  };

  return (
    <div>
      <h2 className="my-2 font-semibold">Languages</h2>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {language
              ? data.find((item) => language === item.iso_639_1)?.english_name
              : "Select Language"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search Language..." />
            <CommandList>
              <CommandEmpty>No Language Found.</CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item.iso_639_1}
                    value={item.english_name}
                    onSelect={(currentValue) => {
                      setLanguage(selectedLanguageIso(currentValue));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        language === item.iso_639_1
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.english_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Languages;

export const LanguagesSkeleton = () => {
  return (
    <div className="p-2">
      <div className="my-2">
        <TitleSkeleton />
      </div>
      <InputSkeleton />
    </div>
  );
};
