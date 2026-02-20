'use client'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@instello/ui/components/input-group'
import { SearchIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import type React from 'react'

export function SearchInput(
  props: React.ComponentProps<typeof InputGroupInput>,
) {
  const [q, setQuery] = useQueryState('q', {
    defaultValue: '',
    clearOnDefault: true,
  })

  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        value={q}
        onChange={(e) => setQuery(e.target.value)}
        {...props}
      />
    </InputGroup>
  )
}
