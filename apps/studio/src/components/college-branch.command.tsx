'use client'

import { Button } from '@instello/ui/components/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@instello/ui/components/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@instello/ui/components/popover'
import { ScrollArea } from '@instello/ui/components/scroll-area'
import { Spinner } from '@instello/ui/components/spinner'
import { CaretDownIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useState } from 'react'
import { useTRPC } from '@/trpc/react'

export default function CollegeBranchCommand({
  value,
  onChange,
  byCollegeId,
}: {
  value?: string
  onChange: (value: string) => void
  byCollegeId?: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.lms.collegeOrBranch.list.queryOptions({
      query: debouncedSearch,
      byCollegeId,
    }),
  )

  const collegesOrBranches = data?.items

  const selectedCollegeOrBranch = collegesOrBranches?.find(
    (c) => c.id === value,
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className="justify-start">
          {value ? selectedCollegeOrBranch?.name : 'Select'}
          <CaretDownIcon className="ml-auto size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
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
            <ScrollArea className="h-60">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {collegesOrBranches?.map((collegeOrBranch) => (
                  <CommandItem
                    key={collegeOrBranch.id}
                    value={collegeOrBranch.id}
                    onSelect={(value) => {
                      onChange(value)
                      setOpen(false)
                    }}
                  >
                    {collegeOrBranch.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
