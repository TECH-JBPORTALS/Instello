'use client'

import type { RouterOutputs } from '@instello/api'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@instello/ui/components/avatar'
import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNowStrict } from 'date-fns'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Subscription =
  RouterOutputs['lms']['subscription']['listByChannelId']['subscribers'][number]

export const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: 'clerkUser',
    header: 'Subscriber',
    cell(props) {
      const original = props.row.original
      return (
        <div className="inline-flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarImage src={original.clerkUser.imageUrl} />
            <AvatarFallback>
              {original.clerkUser.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <p>
            {original.clerkUser.firstName} {original.clerkUser.lastName}
          </p>
        </div>
      )
    },
  },
  {
    id: 'college',
    header: 'College',
    cell(props) {
      const original = props.row.original
      return (
        <div>
          ({original.preferences?.college.code}){' '}
          {original.preferences?.college.name}
        </div>
      )
    },
  },

  {
    accessorKey: 'createdAt',
    header: () => <div className="ml-auto w-20 px-3 text-right">Joined</div>,
    cell(props) {
      return (
        <div className="ml-auto min-w-20 max-w-max px-3">
          <time className="text-muted-foreground text-xs">
            {formatDistanceToNowStrict(props.getValue() as Date, {
              addSuffix: true,
            })}
          </time>
        </div>
      )
    },
  },

  //   {
  //     id: "more-action",
  //     cell() {
  //       return (
  //         <div className="text-right">
  //           <Button
  //             variant={"ghost"}
  //             className="opacity-0 group-hover:opacity-100"
  //             size={"icon"}
  //           >
  //             <DotsThreeIcon weight="bold" />
  //           </Button>
  //         </div>
  //       );
  //     },
  //   },
]
