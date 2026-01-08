import Container from "@/components/container";
import { SearchInput } from "@/components/search-input";
import { SiteHeader } from "@/components/site-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Button } from "@instello/ui/components/button";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

import { DataTableClient } from "./data-table.client";

export default function Page() {
  prefetch(trpc.lms.author.listByChannelId.queryOptions());

  return (
    <HydrateClient>
      <SiteHeader title="Authors" />
      <Container className="px-6">
        <div className="flex justify-between">
          <SearchInput placeholder="Search..." />{" "}
          <Button>
            Add <PlusIcon />
          </Button>
        </div>
        <DataTableClient />
      </Container>
    </HydrateClient>
  );
}
