import { HydrateClient, prefetch, trpc } from '@/trpc/server'

import { ViewsChart } from './views-chart'

export default async function Page({
  params,
}: {
  params: Promise<{ channelId: string }>
}) {
  const { channelId } = await params
  prefetch(trpc.lms.video.getMatricsByChannel.queryOptions({ channelId }))

  return (
    <HydrateClient>
      <div className="col-span-5 space-y-3.5">
        <div className="text-lg font-semibold">Channel Analytics</div>

        <ViewsChart />
      </div>
    </HydrateClient>
  )
}
