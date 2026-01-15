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
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

const chartConfig = {
  views: {
    label: "View",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ViewsChart() {
  const trpc = useTRPC();
  const { videoId } = useParams<{ videoId: string }>();
  const { data } = useSuspenseQuery(
    trpc.lms.video.getMetrics.queryOptions({ videoId }),
  );

  const totalWatchTime = data.overallValues.data.total_watch_time ?? 0;
  const inHoursWatchTime = new Date(totalWatchTime).getHours();
  const remainingMinutes = new Date(totalWatchTime).getMinutes();

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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data.timeseries}
            margin={{
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
              tickFormatter={(value: Date) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value: Date) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={"views"}
              type="monotone"
              stroke={`var(--color-views)`}
              strokeWidth={2}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
