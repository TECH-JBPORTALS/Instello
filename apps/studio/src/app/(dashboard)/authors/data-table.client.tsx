"use client";

import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { columns } from "./columns";

export function DataTableClient() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const { data: authors } = useSuspenseQuery(
    trpc.lms.author.list.queryOptions({ q }),
  );

  return (
    <>
      <DataTable columns={columns} data={authors} />
    </>
  );
}
