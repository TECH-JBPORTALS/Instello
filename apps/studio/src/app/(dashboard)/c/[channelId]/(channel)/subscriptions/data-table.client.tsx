"use client";

import { useParams } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { columns } from "./columns";

export default function DataTableClient() {
  const trpc = useTRPC();
  const { channelId } = useParams<{ channelId: string }>();
  const { data } = useSuspenseQuery(
    trpc.lms.subscription.listByChannelId.queryOptions({ channelId }),
  );

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="text-lg font-semibold">
          Subscriptions {`(${data.totalSubscribers})`}
        </div>
      </div>
      <DataTable columns={columns} data={data.subscribers} />;
    </>
  );
}
