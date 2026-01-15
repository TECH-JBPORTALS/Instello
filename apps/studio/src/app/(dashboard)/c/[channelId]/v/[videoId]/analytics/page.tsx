import Container from "@/components/container";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { ViewsChart } from "./views-chart";

export default async function Page({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  prefetch(trpc.lms.video.getMetrics.queryOptions({ videoId }));

  return (
    <HydrateClient>
      <Container>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Analytics
        </h3>

        <ViewsChart />
      </Container>
    </HydrateClient>
  );
}
