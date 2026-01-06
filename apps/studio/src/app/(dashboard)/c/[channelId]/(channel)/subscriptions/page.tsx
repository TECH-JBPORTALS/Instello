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
        <div className="flex w-full items-center justify-between">
          <div className="text-lg font-semibold">Subscriptions</div>
        </div>
        <DataTableClient />
      </div>
    </HydrateClient>
  );
}
