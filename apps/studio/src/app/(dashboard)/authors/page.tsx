import { Button } from '@instello/ui/components/button'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import type { SearchParams } from 'nuqs'
import Container from '@/components/container'
import { CreateAuthorDialog } from '@/components/dialogs/create-author-dialog'
import { SearchInput } from '@/components/search-input'
import { SiteHeader } from '@/components/site-header'
import { HydrateClient, prefetch, trpc } from '@/trpc/server'
import { loadQuerySearchParams } from '@/utils/searchParams'

import { DataTableClient } from './data-table.client'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { q } = await loadQuerySearchParams(searchParams)
  prefetch(trpc.lms.author.list.queryOptions({ q }))

  return (
    <HydrateClient>
      <SiteHeader title="Authors" />
      <Container className="px-6">
        <div className="flex justify-between">
          <SearchInput placeholder="Search..." />{' '}
          <CreateAuthorDialog>
            <Button>
              <PlusIcon />
              Add
            </Button>
          </CreateAuthorDialog>
        </div>
        <DataTableClient />
      </Container>
    </HydrateClient>
  )
}
