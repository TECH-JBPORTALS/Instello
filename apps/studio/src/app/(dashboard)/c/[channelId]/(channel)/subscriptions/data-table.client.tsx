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

  return <DataTable columns={columns} data={data} />;
}
