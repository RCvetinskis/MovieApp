"use client";
import { useEffect, useState, useTransition } from "react";
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

import { getWatchListsByUserId } from "@/actions/backend/watchlist-serverside";
import { IMediaItemForReactProps, IWatchListResponse } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

import { addMediaItemToWatchlist } from "@/actions/backend/mediaitems-serverside";
import { useToast } from "@/hooks/use-toast";

type Props = {
  mediaItem: IMediaItemForReactProps;
};
export const WatchlistCombobox = ({ mediaItem }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({
    watchlistId: "",
    name: "",
  });
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [watchLists, setWatchLists] = useState<IWatchListResponse[] | []>([]);

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    getWatchListsByUserId(1, 10, debouncedQuery)
      .then((res) => {
        setWatchLists(res.watchlists);
      })
      .catch(() => {
        setWatchLists([]);
      });
  }, [debouncedQuery]);

  const handleSelect = (value: { watchlistId: string; name: string }) => {
    if (!value.watchlistId) return;
    setValue(value);
    setOpen(false);

    startTransition(() => {
      addMediaItemToWatchlist(value.watchlistId, mediaItem)
        .then((res) => {
          toast({
            title: "Success",
            description: res.message,
          });
        })
        .catch((e) => {
          toast({
            title: "Error",
            description: e.message,
          });
        });
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between"
        >
          {value.watchlistId
            ? watchLists.find(
                (list: IWatchListResponse) => list.id === value.watchlistId
              )?.name
            : "Select Watchlist..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        <Command>
          <CommandInput
            disabled={isPending}
            value={query}
            onValueChange={(value) => setQuery(value)}
            placeholder="Search Watchlist..."
          />
          <CommandList>
            <CommandEmpty>No Watchlist found.</CommandEmpty>
            <CommandGroup>
              {watchLists.map((list) => (
                <CommandItem
                  key={list.id}
                  value={list.name}
                  onSelect={() =>
                    handleSelect({ watchlistId: list.id, name: list.name })
                  }
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.watchlistId === list.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {list.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default WatchlistCombobox;
