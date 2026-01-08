"use client";

import type { RouterOutputs } from "@instello/api";
import type { ColumnDef } from "@tanstack/react-table";
import { env } from "@/env";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@instello/ui/components/avatar";
import { Button } from "@instello/ui/components/button";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { formatDistanceToNowStrict } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Subscription = RouterOutputs["lms"]["author"]["list"][number];

export const columns: ColumnDef<Subscription>[] = [
  {
    id: "author",
    header: "Author",
    cell(props) {
      const original = props.row.original;
      return (
        <div className="inline-flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarImage
              src={`https://${env.NEXT_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${original.imageUTFileId}`}
            />
            <AvatarFallback>{original.firstName.charAt(0)}</AvatarFallback>
          </Avatar>
          <p>
            {original.firstName} {original.lastName}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="w-20">Email address</div>,
    cell(props) {
      return (
        <div className="w-full min-w-full max-w-max">
          <time className="text-muted-foreground text-xs">
            {props.getValue() as string}
          </time>
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: () => <div className="ml-auto px-3 text-right">Created</div>,
    cell(props) {
      return (
        <div className="ml-auto max-w-max px-3">
          <time className="text-muted-foreground text-xs">
            {formatDistanceToNowStrict(props.getValue() as Date, {
              addSuffix: true,
            })}
          </time>
        </div>
      );
    },
  },
  {
    id: "more-action",
    cell() {
      return (
        <div className=" ml-auto w-10 text-right">
          <Button variant={"ghost"} size={"icon"}>
            <DotsThreeIcon weight="bold" />
          </Button>
        </div>
      );
    },
  },
];
