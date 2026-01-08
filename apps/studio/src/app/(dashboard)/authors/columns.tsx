"use client";

import type { RouterOutputs } from "@instello/api";
import type { ColumnDef } from "@tanstack/react-table";
import type React from "react";
import { useState } from "react";
import { env } from "@/env";
import { useTRPC } from "@/trpc/react";
import { AlertDescription } from "@instello/ui/components/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@instello/ui/components/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@instello/ui/components/avatar";
import { Button } from "@instello/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@instello/ui/components/dropdown-menu";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { toast } from "sonner";

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
    cell(props) {
      return (
        <div className=" ml-auto w-10 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <DotsThreeIcon weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DeleteAuthorAlertDialog authorId={props.row.original.id}>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                    variant="destructive"
                  >
                    Remove
                  </DropdownMenuItem>
                </DeleteAuthorAlertDialog>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

function DeleteAuthorAlertDialog({
  children,
  authorId,
}: {
  children: React.ReactNode;
  authorId: string;
}) {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: deleteAuthor, isPending } = useMutation(
    trpc.lms.author.delete.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.lms.author.list.queryFilter());
        setOpen(false);
        toast.info("Author removed");
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete author</AlertDialogTitle>
          <AlertDescription>
            Are you sure you want to delete the author, becuase once it's
            deleted, it is an irreversable process.
          </AlertDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"outline"}>Cancel</Button>
          </AlertDialogCancel>
          <Button
            loading={isPending}
            variant={"destructive"}
            onClick={() => deleteAuthor({ authorId })}
          >
            Remove
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
