"use client";

import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { columns } from "./columns";

export function DataTableClient() {
  const trpc = useTRPC();
  const { data: authors } = useSuspenseQuery(
    trpc.lms.author.listByChannelId.queryOptions(),
  );

  return (
    <>
      <DataTable columns={columns} data={authors} />;
    </>
  );
}
