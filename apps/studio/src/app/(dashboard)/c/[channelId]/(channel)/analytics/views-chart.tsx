"use client";

import type { ChartConfig } from "@instello/ui/components/chart";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@instello/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@instello/ui/components/chart";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

const chartConfig = {
  views: {
    label: "View",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ViewsChart() {
  const trpc = useTRPC();
  const { channelId } = useParams<{ channelId: string }>();
  const { data } = useSuspenseQuery(
    trpc.lms.video.getMatricsByChannel.queryOptions({ channelId }),
  );

  const totalWatchTime = data.overallValues.data.total_watch_time ?? 0;
  const inHoursWatchTime = Math.floor(totalWatchTime / 3600);
  const remainingMinutes = Math.floor(
    (totalWatchTime - inHoursWatchTime * 60 * 60) / 60,
  );

  return (
    <Card className="py-4 shadow-none sm:py-0">
      <CardHeader className="p-0! flex flex-col items-stretch border-b sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Views</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-3 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">Total Views</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {data.overallValues.data.total_views}
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-nowrap text-xs">
              Total Watchtime
            </span>
            <span className="text-nowrap text-lg font-bold leading-none sm:text-3xl">
              {inHoursWatchTime}Hr{" "}
              {remainingMinutes !== 0 && <>{remainingMinutes}Min</>}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="w-full">
          <LineChart
            accessibilityLayer
            data={data.timeseries}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: Date) => format(new Date(value), "MMM d")}
            />

            <Line
              dataKey="views"
              type="natural"
              stroke="var(--color-views)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-views)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
            <ChartTooltip content={<ChartTooltipContent active />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
