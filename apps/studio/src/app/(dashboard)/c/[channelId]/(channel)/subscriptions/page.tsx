import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DataTableClient from "./data-table.client";

export default async function Page({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;
  prefetch(trpc.lms.subscription.listByChannelId.queryOptions({ channelId }));

  return (
    <HydrateClient>
      <div className="col-span-5 space-y-3.5">
        <DataTableClient />
      </div>
    </HydrateClient>
  );
}
