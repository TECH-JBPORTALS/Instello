"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { Button } from "@instello/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@instello/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@instello/ui/components/popover";
import { Spinner } from "@instello/ui/components/spinner";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

export default function CollegeBranchCommand({
  value,
  onChange,
  byCollegeId,
}: {
  value?: string;
  onChange: (value: string) => void;
  byCollegeId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.lms.collegeOrBranch.list.queryOptions({
      query: search,
      byCollegeId,
    }),
  );

  const collegesOrBranches = data?.items;

  const selectedCollegeOrBranch = collegesOrBranches?.find(
    (c) => c.id === value,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className="justify-start">
          {value ? selectedCollegeOrBranch?.name : "Select"}
          <CaretDownIcon className="ml-auto size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Spinner />
            </div>
          ) : (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandList className="max-h-60 overflow-y-auto">
                <CommandGroup>
                  {collegesOrBranches?.map((collegeOrBranch) => (
                    <CommandItem
                      key={collegeOrBranch.id}
                      value={collegeOrBranch.id}
                      onSelect={(value) => {
                        onChange(value);
                        setOpen(false);
                      }}
                    >
                      {collegeOrBranch.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
